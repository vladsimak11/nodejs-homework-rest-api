const mongoose = require("mongoose");

const app = require('./app');

const { DB_HOST, PORT = 3000} = process.env;

mongoose.set('strictQuery', true);

mongoose.connect(DB_HOST)
  .then(() => {
    app.listen(PORT, () => {
      console.log("Database connection successful!")
    });
  })
  .catch( error => {
    console.log(error.message);
    process.exit(1);
  })



  const updateAvatar = async (req, res) => {
    const { _id } = req.user;
    const { path: tempUpload, originalname } = req.file;
    const filename = `${_id}_${originalname}`;
  
    const resultUpload = path.join(avatarsDir, filename);
  
    Jimp.read(tempUpload, (err, img) => {
      if (err) throw err;
      img.resize(250, 250).write(resultUpload);
    });
  
    await fs.rename(tempUpload, resultUpload);
    const avatarURL = path.join("avatars", filename);
  
    await User.findByIdAndUpdate(_id, { avatarURL });
  
    res.json({
      avatarURL,
    });
  };