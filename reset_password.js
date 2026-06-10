const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

mongoose.connect('mongodb+srv://xpertance:XPERTANCE@cluster0.dnv2io.mongodb.net/salon_management?retryWrites=true&w=majority')
  .then(async () => {
    const hashedPassword = await bcrypt.hash('Test@123', 10);
    await mongoose.connection.db.collection('users').updateOne(
      { email: 'lokeek.innonsh@gmail.com' },
      { $set: { password: hashedPassword } }
    );
    console.log('Password updated successfully');
    mongoose.disconnect();
  })
  .catch(console.error);
