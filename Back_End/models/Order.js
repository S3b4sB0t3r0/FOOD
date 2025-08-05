import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  items: [
    {
      id: { type: String, required: true },
      title: { type: String, required: true },
      description: String,
      price: { type: Number, required: true },
      image: String,
      quantity: { type: Number, required: true },
      observation: String,
    }
  ],
  orderDescription: {
    type: String,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pendiente', 'en preparación', 'enviado', 'entregado'],
    default: 'pendiente',
  },
  customerEmail: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.model('Order', OrderSchema);
export default Order;