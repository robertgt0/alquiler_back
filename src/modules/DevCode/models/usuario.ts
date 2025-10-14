import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "El apellido es obligatorio"],
      trim: true,
    },
    ci: {
      type: String,
      required: [true, "El número de CI es obligatorio"],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "El correo electrónico es obligatorio"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/.+\@.+\..+/, "Correo electrónico no válido"],
    },
    phone: {
      type: String,
      trim: true,
      match: [/^\+?\d{7,15}$/, "Número de teléfono no válido"],
    },
    password: {
      type: String,
      required: [true, "La contraseña es obligatoria"],
      minlength: [6, "La contraseña debe tener al menos 6 caracteres"],
      select: false, // 👈 evita devolver el hash por defecto
    },
    role: {
      type: String,
      enum: ["cliente", "proveedor", "admin"],
      default: "cliente",
    },
  },
  {
    timestamps: true, // crea automáticamente createdAt y updatedAt
  }
);

// Evita mostrar la contraseña al convertir a JSON o al devolver desde API
UserSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.__v;
  return user;
};

export default mongoose.models.User || mongoose.model("User", UserSchema);

