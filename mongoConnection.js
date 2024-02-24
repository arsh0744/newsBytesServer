const { MongoClient, ServerApiVersion } = require('mongodb');
const mongoose = require('mongoose');


// 
//

let uncodedUserName = 'arsh0744' ;
let uncodedPassword = 'ashu@0744'


const username = encodeURIComponent(uncodedUserName);
const password = encodeURIComponent(uncodedPassword);


const mongoDbURL = `mongodb+srv://${username}:${password}@cluster0.imu3vxw.mongodb.net?retryWrites=true&w=majority`;


 


async function connectToMongoDB() {

    return await new Promise(
        async (resolve,reject) =>
        {
            try {
                let connection = await mongoose.connect(mongoDbURL,
                    {
                        serverSelectionTimeoutMS: 300000
                    }
                    )
                if(connection)
                {
                    resolve(connection);
                }
                else
                {
                    reject(null);
                }
           
             
           
             } catch (error) {
               console.error('Error connecting to MongoDB: ', error);
               reject(null);
             }
        }
    )

  
}

async function closeMongoDBConnection() {
    return new Promise(
        async (resolve,reject) =>
        {
            try {
                await mongoose.disconnect()
                 resolve(true) ;
               } catch (error) {
               //  console.error('Error closing MongoDB connection:', error);
                 reject(false);
               }
        }
    )
 
}

module.exports = {
  connectToMongoDB,
  closeMongoDBConnection,
};
