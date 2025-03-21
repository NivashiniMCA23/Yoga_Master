const express = require('express');
const cors = require('cors');
require('dotenv').config();
const stripe = require("stripe")(process.env.PAYMENT_SECRET);
const jwt = require('jsonwebtoken');
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Verify token
const verifyJWT = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization) {
    return res.status(401).send({ message: 'Invalid authorization' });
  }

  const token = authorization?.split(' ')[1];
  jwt.verify(token, process.env.ASSESS_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).send({ message: 'Forbidden access' });
    }
    req.decoded = decoded;
    next();
  });
};


// MongoDB connection
const { MongoClient, ServerApiVersion, ObjectId, ServerDescription, StreamDescription, Transaction } = require('mongodb');
const { parse } = require('dotenv');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@yoga-master.zyukf.mongodb.net/?retryWrites=true&w=majority&appName=Yoga-master`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();

    // Create a database and collections
    const database = client.db("yoga-master");
    const usersCollection = database.collection("users");
    const classesCollection = database.collection("classes");
    const cartCollection = database.collection("cart");
    const paymentCollection = database.collection("payments");
    const enrolledCollection = database.collection("enrolled");
    const appliedCollection = database.collection("applied");


    // routes for users
   app.post("/api/set/token" , async (req,res)=>
  {
    const user= req.body;
    const token = jwt.sign(user,process.env.ASSESS_SECRET,
      {
        expiresIn: '24h'
      });
      res.send({token})
  })


  // middileware for admin and instructors
    // const verifyAdmin =async (res,req,next)=>
    // {
    //   const email = req.decoded.email;
    //   const query = {email: email};
    //   const user = await usersCollection.findOne (query);
    //   if(user.role === 'admin')
    //   {
    //     next();
    //   }
    //   else{
    //     return res.status(401).send({message:'Forbidden access'})
    //   }
    // }
    const verifyAdmin = async (req, res, next) => {
      try {
          const email = req.decoded?.email; // Ensure req.decoded exists
          if (!email) {
              return res.status(403).json({ message: "Unauthorized access" });
          }
  
          const query = { email: email };
          const user = await usersCollection.findOne(query);
  
          if (!user || user.role !== "admin") {
              return res.status(401).json({ message: "Forbidden access" });
          }
  
          next(); // Proceed if user is admin
      } catch (error) {
          console.error("Error in verifyAdmin middleware:", error);
          return res.status(500).json({ message: "Internal server error" });
      }
  };
  
    const verifyInstructor = async (req,res, next)=>
    {
      const email = req.decoded.email;
      const query = {email:email};
      const user = await usersCollection.findOne(query);
      if(user.role === 'instructor')
      {
        next();
      }
      else{
        return res.status(401).send({message:'Unauthorized access'})
      }
    };
   app.post('/new-user', async(req,res)=>
  {
    const newUser = req.body;
    const result = await usersCollection.insertOne(newUser);
    res.send(result);
  });
  app.get('/users',async (req,res)=>
  {
    const result = await usersCollection.find({}).toArray();
    res.send(result);
  });
  app.get('/users/:id', async(req,res)=>
  {
    const id = req.params.id;
    const query ={_id: new ObjectId(id)};
    const result = await usersCollection.findOne(query);
    res.send(result);
  });
  app.get('/user/:email',verifyJWT, async(req,res)=>
  {
    const email = req.params.email;
    const query = {email: email};
    const result = await usersCollection.findOne(query);
    res.send(result);
  });
  app.delete('/delete-user/:id',verifyJWT,verifyAdmin, async (req,res)=>
  {
    const id = req.params.id;
    const query ={ _id: new ObjectId(id)};
    const result = await usersCollection.deleteOne(query);
    res.send(result);
  });
  
  app.put('/update-user/:id', verifyJWT,verifyAdmin,async(req,res)=>
  {
    const id = req.params.id;
    const updatedUser = req.body;
    const filter ={_id: new ObjectId(id)};
    const options ={upsert: true};
    const updateDoc = {
      $set:{
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        address: updatedUser.address,
        about: updatedUser.about,
        photoUrl: updatedUser.photoUrl,
        skills: updatedUser.skills ? updatedUser.skills : null,
      }
    }
    const result = await usersCollection.updateOne(filter, updateDoc, options);
    res.send(result);
  });

  
  // app.patch("/update-user/:id", verifyJWT, verifyAdmin, async (req, res) => {
  //   console.log("Update request received for ID:", req.params.id); // Debugging
  
  //   try {
  //     const id = req.params.id;
  //     const updatedUser = req.body;
  
  //     const filter = { _id: new ObjectId(id) };
  //     const updateDoc = { $set: updatedUser };
  
  //     const result = await usersCollection.updateOne(filter, updateDoc);
  //     res.json(result);
  //   } catch (error) {
  //     console.error("Error updating user:", error);
  //     res.status(500).json({ error: "Internal Server Error" });
  //   }
  // });
  
    // Classes routes
    app.post("/new-class", verifyJWT, verifyInstructor, async (req, res) => {
      const newClass = req.body;
      newClass.availableSeats = parseInt(newClass.availableSeats);
      const result = await classesCollection.insertOne(newClass);
      res.send(result);
      console.log(newClass);
    });


    
    // app.post("/new-class", verifyJWT, verifyInstructor, async (req, res) => {
    //   try {
    //     const newClass = req.body;
    //     newClass.availableSeats = parseInt(newClass.availableSeats);
    //     const result = await classesCollection.insertOne(newClass);
    //     res.send(result);
    //   } catch (error) {
    //     console.error(error);
    //     res.status(500).send({ message: "Internal Server Error" });
    //   }
    // });


    ///approve-instructor
    app.patch("/approve-instructor/:id", verifyJWT, verifyAdmin, async (req, res) => {
      try {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };
        const updateDoc = { $set: { role: "instructor" } };
    
        const result = await usersCollection.updateOne(filter, updateDoc);
        res.json(result);
      } catch (error) {
        console.error("Error approving instructor:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });
    
   

    app.get("/classes", async (req,res) =>
    {
     const query = {status: 'approved'}; 
     const result = await classesCollection.find().toArray();
     res.send(result);
    })

    // get classes by instructor email address
    app.get("/classes/:email",verifyJWT,verifyInstructor, async (req,res) =>{
      const email = req.params.email;
      const query = {instructorEmail: email};
      const result = await classesCollection.find(query).toArray();
      res.send(result);
    })


    // manage classes
    app.get("/classes-manage", async(req,res)=>
    {
      const result = await classesCollection.find().toArray();
      res.send(result);
    })
    //update classes
    app.patch("/change-status/:id",verifyJWT,verifyAdmin, async(req,res)=>
    {
      const id = req.params.id;
      const status = req.body.status;
      const reason = req.body.reason;
      const filter = {_id: new ObjectId(id)};
      const options = { upsert: true};
      const updateDoc= {
      $set:{
        status: status,
        reason: reason,
      },
    };
      const result = await classesCollection.updateOne(filter,updateDoc,options);
      res.send(result);
    })

    // get approved classes 
    app.get("/approved-classes", async(req,res)=>
    {
      const query ={status: "approved"};
      const result = await classesCollection.find(query).toArray();
      res.send(result);
    });

   // get single classes details
   app.get("/class/:id", async(req,res)=>
  {
    const id = req .params.id;
    const query = {_id: new ObjectId(id)};
    const result = await classesCollection.findOne(query);
    res.send(result);
  })

  // update class details (all data)
  app.put("/update-class/:id",verifyJWT,verifyInstructor, async (req,res)=>
  {
    const id = req.params.id;
    const updateClass = req.body;
    const filter ={_id: new ObjectId(id)};
    const options ={ upsert: true};
    const updateDoc ={
      $set:{
        name: updateClass.name,
        description: updateClass.description,
        availableSeats: parseInt(updateClass.availableSeats),
        price: updateClass.price,
        videoLink: updateClass.videoLink,
        status: 'pending',
      }
    };
    const result = await classesCollection.updateOne(filter,updateDoc,options);
    res.send(result);
  })
  // cart routes 
    app.post("/add-to-cart",verifyJWT, async (req,res)=>
    {
      const newCartItem = req.body ;
      const result = await cartCollection.insertOne(newCartItem);
      res.send(result);
    })
    //get cart item by id
    app.get("/cart-item/:id",verifyJWT,async(req,res)=>
    {
      const id = req.params.id;
      const email = req.body.email;
      const query ={
        classId: id,
        userMail:email
      };
     const projection={classId: 1};
      const result = await cartCollection.findOne(query,{projection: projection});
      res.send(result);
    })
    //  // cart info by user email
    //  app.get("/cart/:email",verifyJWT,async (req,res)=>
    // {
    //   const email= req.params.email;
    //   const query ={userMail: email};
    //   const projection={classId: 1};
    //   const carts = await cartCollection.find(query,{projection: projection});
    //   const classIds = carts.map(cart => new ObjectId(cart.classId));
    //   const query2 ={_id: {$in: classIds}};
    //   const result = await classesCollection.find(query2).toArray();
    //   res.send(result);
    // });


    // Cart info by user email
  app.get("/cart/:email", verifyJWT, async (req, res) => {
  try {
    const email = req.params.email;
    const query = { userMail: email };
    const projection = { classId: 1 };

    // Convert cursor to array
    const carts = await cartCollection.find(query, { projection }).toArray();

    // Extract class IDs
    const classIds = carts.map(cart => new ObjectId(cart.classId));

    // Query classes using these IDs
    const result = await classesCollection.find({ _id: { $in: classIds } }).toArray();

    res.send(result);
  } catch (error) {
    console.error("Error fetching cart info:", error);
    res.status(500).send({ message: "Internal server error" });
  }
});

    //delete carts item
    app.delete("/delete-cart-item/:id", verifyJWT, async (req, res) => {
      const id = req.params.id;
      const query = { classId: id };
    
      try {
        const result = await cartCollection.deleteOne(query);
        console.log(result);  // Log the result to check the structure
        res.send(result);  // Ensure 'deletedCount' is included in the response
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error deleting item' });
      }
    });
    
    
    // app.delete("/delete-cart-item/:id",verifyJWT, async (req,res)=>
    // {
    //   const id = req.params.id;
    //   const query = {classId: id};
    //   const result = await cartCollection.deleteOne(query);
    //   res.send(result);
    // });

    //payment routes
//   app.post("/create-payment-intent",async (req,res)=>
//   {
//     const { price } = req.body;
//     const amount = parseInt(price) * 100;
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: amount,
//       currency: "usd",
//       payment_method_types:["card"],
//     });
//     res.send({
//       clientSecret: paymentIntent.client_secret,
//   });
//  })


// Payment Routes
 
app.post("/create-payment-intent", async (req, res) => {
  try {
    const { price } = req.body;

    if (!price || isNaN(price)) {
      return res.status(400).json({ error: "Invalid price value" });
    }

    const amount = parseInt(price) * 100; // Convert to cents

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      payment_method_types: ["card"],
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).json({ error: "Failed to create payment intent" });
  }
});


/// post payement info to db 
app.post("/payment-info",verifyJWT, async(req,res)=>
{
  const paymentInfo = req.body;
  const classesId = paymentInfo.classesId;
  const userEmail = paymentInfo.userEmail;
  const singleClassId = req.query.classId;
  let query;
  if(singleClassId){
    query ={classId: singleClassId, userMail: userEmail};
  } else 
  {
    query = { classId: { $in: classesId }};
  }
  const classesQuery = {_id: {$in : classesId.map( id => new ObjectId(id))}};
  const classes = await classesCollection.find(classesQuery).toArray();
  const newEnrolledData = {
    userEmail: userEmail,
    classId: singleClassId.map(id => new objectId (id)),
    TransactionId: paymentInfo.TransactionId
  };
  const updatedDoc ={
    $set:{
      totalEnrolled: classes.reduce((total,current)=> total + current. totalEnrolled,0) + 1 || 0,
      availableSeats: classes.reduce((total, current) => total + current.availableSeats, 0) - 1 || 0
    }
  };
  const updateResult = await classesCollection.updateMany(classesQuery, updatedDoc, { upsert: true });
  const enrolled = await enrolledCollection.insertOne(newEnrolledData);
  const deletedResult = await cartCollection.deleteMany(query);
  const payementResult  = await paymentCollection.insertOne(paymentInfo);
  res.send({payementResult,deletedResult,enrolledResult, updateResult})
});
    // get payment history 

    app.get("/payment-history/:email", async(req,res)=>
    {
      const email = req.params.email;
      const query = {userEmail: email};
      const result = await paymentCollection.find(query).sort({date: -1}).toArray();
        res.send(result);  
    });

    //payment history length
    app.get("/payment-history-length/:email", async (req,res)=>
    {
     const email = req.params.email;
     const query = { userEmail:email};
     const total = await paymentCollection.countDocuments(query);
     res.send({total});
    });

    // enrollment routes
    app.get("/popular_classes", async(req,res)=>
    {
     const result = await classesCollection.find().sort({totalEnrolled: -1}).limit(6).toArray();
     res.send(result);
    })

    // app.get('/instructors', async (req, res) => {
    //   try {
    //     const instructors = await usersCollection.find({ role: "instructor" }).toArray(); // Assuming 'role' identifies instructors
    //     res.send(instructors);
    //   } catch (error) {
    //     console.error("Error fetching instructors:", error);
    //     res.status(500).send({ error: "An error occurred while fetching instructors." });
    //   }
    // });
    

    app.get('/popular-instructors',async (req,res)=>
    {
      const pipeline =[
        {
        $group:
        {
          _id: "$instructorEmail",
          totalEnrolled:{$sum: "$totalEnrolled"},
          
        }
      },
      {
        $lookup:
        {
          from: "users",
          localField: "_id",
          foreignField: "email",
          as: "instructor"
        }
      },
      {
        $project: {
          _id: 0,
          instructor: {
            $arrayElemAt: ["$instructor", 0]
          }, 
          totalEnrolled: 1
        }
      },
    {
      $sort: {
        totalEnrolled: -1
      }
    },
    {
      $limit: 6
    }
      ];
      const result = await classesCollection.aggregate(pipeline).toArray();
      res.send(result);
    });

    //admin status
    app.get('/admin-status', verifyJWT, verifyAdmin, async (req, res) => {
      try {
          const approvedClasses = await classesCollection.countDocuments({ status: 'approved' });
          const pendingClasses = await classesCollection.countDocuments({ status: 'pending' });
          const instructor = await usersCollection.countDocuments({ role: 'instructor' });
          const totalClasses = await classesCollection.countDocuments();
          const totalEnrolled = await enrolledCollection.countDocuments();
  
          const result = {
              approvedClasses,
              pendingClasses,
              instructor,
              totalClasses,
              totalEnrolled
          };
  
          res.send(result);
      } catch (error) {
          console.error("Error fetching admin stats:", error);
          res.status(500).send({ message: "Internal Server Error" });
      }
  });
  
   

    // Get all instructor
    app.get('/instructors', async(req,res)=>
    {
      const result = await usersCollection.find({role: 'instructor'}).toArray();
      res.send(result);
    });

    app.get('/enrolled-classes/:email',verifyJWT, async (req,res) =>
    {
     const email = req.params.email;
     const query ={userEmail: email};
     const pipeline = [
      {
        $match: query
      },
      {
        $lookup:
        {
          from: "classes",
          localField: "classesId",
          foreignField: "_id",
          as: "classes"
        }
      },
    {
      $unwind:"$classes"
    },
    {
      $lookup:
      {
        from: "users",
        localField: "classes.instructorEmail",
        foreignField: "email",
        as: "instructor"
      }
    },
    {
      $project:
      {
        _id: 0,
        instructor:
        {
          $arrayElemAt: ["$instructor", 0]
        },
        classes: 1
      }
    }
     ];
     const result = await enrolledCollection.aggregate(pipeline).toArray();
     res.send(result);
    });

    // Appliend for instructors
    app.post('/ass-instructor', async (req,res) =>
    {
      const data = req.body;
      const result = await appliedCollection.insertOne(data);
      res.send(result);
    });
    app.get('/applied-instructors/:email', async(req,res)=>
    {
      const email = req.params.email;
      const result = await appliedCollection.findOne({email});
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });

    console.log("Successfully connected to MongoDB!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
  }
}

// Call the run function but DO NOT close the client
run();

// Root endpoint
app.get('/', (req, res) => {
  res.send('Hello Niva N!');
});

// Start the server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
