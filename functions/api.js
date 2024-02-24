const express = require('express');
const serverless = require('serverless-http');
const mongoose = require('mongoose');
const { connectToMongoDB, closeMongoDBConnection } = require('../mongoConnection');
const cors = require('cors');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const Url = require('../mongooseSchema/urlSchema');


const app = express();
const router = express.Router();

app.use(cors());
app.use(bodyParser.json());


const PORT = process.env.PORT || 3000;
const baseUrl = 'https://newsbytesarshjot.netlify.app/.netlify/functions/api/';






router.post('/hash', async (req, res) => {
  const longUrl = req.body.longUrl;
  const basicUtm = req.body.basicUtm;

  const hash = crypto.createHash('sha256').update(longUrl).digest('hex');

  try {
    const url = new Url({
      hash: hash,
      longUrl: longUrl,
      source: basicUtm.source 
    });

    try {
      await connectToMongoDB().then(
        async () =>
        {
          await url.save();
          const hashedUrl = `${baseUrl}${url.longUrl}/hashes/${hash}`;

          res.json({ hashedUrl });
        }
      )
     
     
    }
    catch(e)
    {
      console.error("connection error ",e);
    } 
    finally {
      await closeMongoDBConnection();
    }



   
  } catch (err) {
    console.error('Error saving URL:', err);
    return res.status(500).json({ message: 'Failed to save URL' });
  }

 
});

router.get('/*/hashes/:hash', async (req, res) => {
  const hash = req.params.hash;

  try {

    try {
      await connectToMongoDB().then(
        async () =>
        {
          const url = await Url.findOne({ hash: hash });
          if (!url) {
            return res.status(404).json({ message: 'Hash not found' });
          }

          url.clicks++;
          await url.save();
          
          res.send("Site Visited");
        }
      )
     
     
    }
    catch(e)
    {
      console.error("connection error ",e);
      reject({Error:true,Message:e.Message})
    } 
    finally {
      await closeMongoDBConnection();
    }



    

  } catch (err) {
    console.error('Error finding URL:', err);
    return res.status(500).json({ message: 'Failed to find URL' });
  }
});
router.get('/urls', async (req, res) => {
  try {

    try {
      await connectToMongoDB().then(
        async () =>
        {
          const urls = await Url.find({}, { hash: 1, longUrl: 1, clicks: 1, source: 1 });
          res.json(urls);
        }
      )
     
     
    }
    catch(e)
    {
      console.error("connection error ",e);
    } 
    finally {
      await closeMongoDBConnection();
    }


    
   
  } catch (err) {
    console.error('Error fetching URLs:', err);
    return res.status(500).json({ message: 'Failed to fetch URLs' });
  }
});


router.get('/try', async (req, res) => {
  res.send('hello')
});






app.listen(PORT,()=>{console.log(`Listening on Port:${PORT}`)})

app.use('/.netlify/functions/api', router);
module.exports.handler = serverless(app);