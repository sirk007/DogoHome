module.exports = (sequelize, DataTypes) => {
    // Define the Users model
    const Users = sequelize.define("Users", {
      // Define username column
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      age: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userType: {
        type: DataTypes.STRING,
        defaultValue: 'User'
      }
    });
        // Return the Users model
    return Users;
};