const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const stripe = require("stripe");
const jwt = require("jsonwebtoken");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Initialize Stripe
const stripeClient = stripe(process.env.PAYMENT_SECRET);

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@yoga-master.zyukf.mongodb.net/?retryWrites=true&w=majority&appName=Yoga-master`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect(); // Connect to MongoDB

    // Database & Collections
    const database = client.db("yoga-master");
    const usersCollection = database.collection("users");
    const classesCollection = database.collection("classes");
    const cartCollection = database.collection("cart");
    const paymentCollection = database.collection("payments");
    const enrolledCollection = database.collection("enrolled");
    const appliedCollection = database.collection("applied");

    // JWT Middleware
    const verifyJWT = (req, res, next) => {
      const authorization = req.headers.authorization;
      if (!authorization) return res.status(401).send({ message: "Unauthorized" });

      const token = authorization.split(" ")[1];
      jwt.verify(token, process.env.ACCESS_SECRET, (err, decoded) => {
        if (err) return res.status(403).send({ message: "Forbidden" });
        req.decoded = decoded;
        next();
      });
    };

    // Verify Admin Middleware
    const verifyAdmin = async (req, res, next) => {
      const email = req.decoded.email;
      const user = await usersCollection.findOne({ email });
      if (user?.role === "admin") return next();
      return res.status(403).send({ message: "Forbidden" });
    };

    // Verify Instructor Middleware
    const verifyInstructor = async (req, res, next) => {
      const email = req.decoded.email;
      const user = await usersCollection.findOne({ email });
      if (user?.role === "instructor") return next();
      return res.status(403).send({ message: "Forbidden" });
    };

    // Generate JWT Token
    app.post("/api/set/token", async (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.ACCESS_SECRET, { expiresIn: "24h" });
      res.send({ token });
    });

    // User Routes
    app.post("/new-user", async (req, res) => {
      const result = await usersCollection.insertOne(req.body);
      res.send(result);
    });

    app.get("/users", async (req, res) => {
      const result = await usersCollection.find().toArray();
      res.send(result);
    });

    app.get("/users/:id", async (req, res) => {
      const result = await usersCollection.findOne({ _id: new ObjectId(req.params.id) });
      res.send(result);
    });

    app.get("/user/:email", verifyJWT, async (req, res) => {
      const result = await usersCollection.findOne({ email: req.params.email });
      res.send(result);
    });

    app.delete("/delete-user/:id", verifyJWT, verifyAdmin, async (req, res) => {
      const result = await usersCollection.deleteOne({ _id: new ObjectId(req.params.id) });
      res.send(result);
    });

    // Class Routes
    app.post("/new-class", verifyJWT, verifyInstructor, async (req, res) => {
      const result = await classesCollection.insertOne(req.body);
      res.send(result);
    });

    app.get("/classes", async (req, res) => {
      const result = await classesCollection.find({ status: "approved" }).toArray();
      res.send(result);
    });

    app.get("/class/:id", async (req, res) => {
      const result = await classesCollection.findOne({ _id: new ObjectId(req.params.id) });
      res.send(result);
    });

    app.put("/update-class/:id", verifyJWT, verifyInstructor, async (req, res) => {
      const result = await classesCollection.updateOne(
        { _id: new ObjectId(req.params.id) },
        { $set: req.body },
        { upsert: true }
      );
      res.send(result);
    });

    // Cart Routes
    app.post("/add-to-cart", verifyJWT, async (req, res) => {
      const result = await cartCollection.insertOne(req.body);
      res.send(result);
    });

    app.get("/cart/:email", verifyJWT, async (req, res) => {
      const result = await cartCollection.find({ userMail: req.params.email }).toArray();
      res.send(result);
    });

    app.delete("/delete-cart-item/:id", verifyJWT, async (req, res) => {
      const result = await cartCollection.deleteOne({ classId: req.params.id });
      res.send(result);
    });

    // Payment Routes
    app.post("/create-payment-intent", async (req, res) => {
      const { price } = req.body;
      const paymentIntent = await stripeClient.paymentIntents.create({
        amount: price * 100,
        currency: "usd",
        payment_method_types: ["card"],
      });
      res.send({ clientSecret: paymentIntent.client_secret });
    });

    app.post("/payment-info", verifyJWT, async (req, res) => {
      const { classesId, userEmail, TransactionId } = req.body;
      const classIds = classesId.map((id) => new ObjectId(id));

      const updateResult = await classesCollection.updateMany(
        { _id: { $in: classIds } },
        {
          $inc: { totalEnrolled: 1, availableSeats: -1 },
        }
      );

      const enrolled = await enrolledCollection.insertOne({
        userEmail,
        classId: classIds,
        TransactionId,
      });

      const deletedResult = await cartCollection.deleteMany({ classId: { $in: classesId } });

      res.send({ updateResult, enrolled, deletedResult });
    });

    // Admin Dashboard Data
    app.get("/admin-status", verifyJWT, verifyAdmin, async (req, res) => {
      const [approvedClasses, pendingClasses, instructors, totalClasses, totalEnrolled] =
        await Promise.all([
          classesCollection.countDocuments({ status: "approved" }),
          classesCollection.countDocuments({ status: "pending" }),
          usersCollection.countDocuments({ role: "instructor" }),
          classesCollection.countDocuments(),
          enrolledCollection.countDocuments(),
        ]);

      res.send({ approvedClasses, pendingClasses, instructors, totalClasses, totalEnrolled });
    });

    // Root Route
    app.get("/", (req, res) => {
      res.send("Yoga Master Backend Running!");
    });

    console.log("🚀 Successfully connected to MongoDB!");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
  }
}

// Run the Server
run();

app.listen(port, () => {
  console.log(`🔥 Server running on port ${port}`);
});
