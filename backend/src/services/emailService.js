import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOTP = async (email, otp) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verify Your Email - Khakhra Co.",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #f97316;">🌾 Khakhra Co.</h2>
        <p>Your verification code is:</p>
        <h1 style="background: #fff7ed; padding: 20px; text-align: center; letter-spacing: 8px; color: #f97316;">${otp}</h1>
        <p style="color: #666;">This code expires in 10 minutes.</p>
      </div>
    `,
  });
};

export const sendResetLink = async (email, resetLink) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Reset Your Password - Khakhra Co.",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #f97316;">🌾 Khakhra Co.</h2>
        <p>You requested a password reset. Click the button below:</p>
        <a href="${resetLink}" style="display: inline-block; margin: 20px 0; padding: 14px 28px; background: #f97316; color: white; text-decoration: none; border-radius: 10px; font-weight: bold;">Reset Password</a>
        <p style="color: #666;">This link expires in 1 hour. If you didn't request this, ignore this email.</p>
      </div>
    `,
  });
};

const orderItemsHtml = (items) =>
  items.map(i => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #f3f4f6;">${i.title}</td>
      <td style="padding: 10px; border-bottom: 1px solid #f3f4f6; text-align:center;">${i.weight || '-'}</td>
      <td style="padding: 10px; border-bottom: 1px solid #f3f4f6; text-align:center;">${i.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #f3f4f6; text-align:right;">₹${(i.price * i.quantity).toFixed(2)}</td>
    </tr>`).join("");

export const sendOrderConfirmation = async (email, name, orderId, items, total, deliveryFee, address) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: `Order Confirmed #${orderId} - Khakhra Co.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #f97316, #f59e0b); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0;">🌾 Khakhra Co.</h1>
          <p style="color: #fff7ed; margin: 8px 0 0;">Order Confirmed!</p>
        </div>
        <div style="background: #fff; padding: 30px; border: 1px solid #f3f4f6; border-top: none; border-radius: 0 0 12px 12px;">
          <p>Hi <strong>${name}</strong>,</p>
          <p>Your order <strong>#${orderId}</strong> has been placed successfully! 🎉</p>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <thead>
              <tr style="background: #fff7ed;">
                <th style="padding: 10px; text-align: left;">Item</th>
                <th style="padding: 10px; text-align: center;">Weight</th>
                <th style="padding: 10px; text-align: center;">Packs</th>
                <th style="padding: 10px; text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>${orderItemsHtml(items)}</tbody>
          </table>
          <div style="text-align: right; padding: 10px 0; border-top: 2px solid #f97316;">
            <p style="margin: 4px 0; color: #666;">Delivery: ${deliveryFee === 0 ? 'FREE' : '₹' + deliveryFee}</p>
            <p style="margin: 4px 0; font-size: 18px; font-weight: bold; color: #f97316;">Total: ₹${total.toFixed(2)}</p>
          </div>
          <p style="color: #666; margin-top: 20px;"><strong>Delivery Address:</strong> ${address}</p>
          <p style="color: #666;">We'll notify you once your order is shipped. Thank you for choosing Khakhra Co.!</p>
        </div>
      </div>
    `,
  });
};

export const sendAdminOrderNotification = async (adminEmail, userName, orderId, items, total, address) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: adminEmail,
    subject: `New Order #${orderId} from ${userName} - Khakhra Co.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #f97316;">🌾 New Order Received</h2>
        <p><strong>Order #${orderId}</strong> from <strong>${userName}</strong></p>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <thead>
            <tr style="background: #fff7ed;">
              <th style="padding: 10px; text-align: left;">Item</th>
              <th style="padding: 10px; text-align: center;">Weight</th>
              <th style="padding: 10px; text-align: center;">Packs</th>
              <th style="padding: 10px; text-align: right;">Amount</th>
            </tr>
          </thead>
          <tbody>${orderItemsHtml(items)}</tbody>
        </table>
        <p style="font-size: 18px; font-weight: bold; color: #f97316;">Total: ₹${total.toFixed(2)}</p>
        <p><strong>Delivery Address:</strong> ${address}</p>
      </div>
    `,
  });
};

const statusMeta = {
  confirmed: { emoji: "✅", label: "Order Confirmed",  msg: "Your order has been confirmed and is being prepared.", color: "#3b82f6" },
  shipped:   { emoji: "🚚", label: "Order Shipped",    msg: "Your order is on its way! Expect delivery in 1-2 days.", color: "#8b5cf6" },
  delivered: { emoji: "🎉", label: "Order Delivered",  msg: "Your order has been delivered. Enjoy your khakhras!", color: "#22c55e" },
  cancelled: { emoji: "❌", label: "Order Cancelled",  msg: "Your order has been cancelled. Contact us for help.", color: "#ef4444" },
  pending:   { emoji: "🕐", label: "Order Pending",    msg: "Your order is pending confirmation.", color: "#f59e0b" },
};

export const sendOfferEmail = async (email, name, offer) => {
  const { title, subtitle, badge, emoji, bg_from, bg_to, expires_at } = offer;
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: `${emoji} ${title} - Exclusive Offer from Khakhra Co.!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, ${bg_from || '#f97316'}, ${bg_to || '#f59e0b'}); padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0;">
          <div style="font-size: 56px; margin-bottom: 12px;">${emoji}</div>
          ${badge ? `<span style="background: rgba(255,255,255,0.2); color: white; font-size: 12px; font-weight: bold; padding: 4px 12px; border-radius: 20px;">${badge}</span>` : ''}
          <h1 style="color: white; margin: 12px 0 4px; font-size: 26px;">${title}</h1>
          ${subtitle ? `<p style="color: rgba(255,255,255,0.85); margin: 0; font-size: 15px;">${subtitle}</p>` : ''}
        </div>
        <div style="background: #fff; padding: 30px; border: 1px solid #f3f4f6; border-top: none; border-radius: 0 0 12px 12px; text-align: center;">
          <p style="color: #374151;">Hi <strong>${name}</strong>, we have an exclusive offer just for you!</p>
          ${expires_at ? `<p style="color: #f97316; font-size: 13px;">⏰ Hurry! Offer expires on ${new Date(expires_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>` : ''}
          <a href="${process.env.FRONTEND_URL}" style="display: inline-block; margin: 20px 0; padding: 14px 32px; background: linear-gradient(135deg, ${bg_from || '#f97316'}, ${bg_to || '#f59e0b'}); color: white; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 15px;">Shop Now 🛒</a>
          <p style="color: #9ca3af; font-size: 12px; margin-top: 20px;">You're receiving this because you're a valued Khakhra Co. customer.</p>
        </div>
      </div>
    `,
  });
};

export const sendOrderStatusUpdate = async (email, name, orderId, status, contact) => {
  const meta = statusMeta[status] || statusMeta.pending;

  // Email notification
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: `${meta.emoji} ${meta.label} - Order #${orderId} | Khakhra Co.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: ${meta.color}; padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
          <div style="font-size: 48px;">${meta.emoji}</div>
          <h2 style="color: white; margin: 8px 0 0;">${meta.label}</h2>
        </div>
        <div style="background: #fff; padding: 30px; border: 1px solid #f3f4f6; border-top: none; border-radius: 0 0 12px 12px;">
          <p>Hi <strong>${name}</strong>,</p>
          <p>${meta.msg}</p>
          <div style="background: #fff7ed; border-radius: 10px; padding: 16px; margin: 20px 0; text-align: center;">
            <p style="margin: 0; color: #666; font-size: 13px;">Order ID</p>
            <p style="margin: 4px 0 0; font-size: 22px; font-weight: bold; color: #f97316;">#${orderId}</p>
          </div>
          <p style="color: #666;">Thank you for choosing Khakhra Co. 🌾</p>
        </div>
      </div>
    `,
  });
};

export const sendDeliveryDateResponse = async (email, name, orderId, action, adminDate, reason) => {
  const isAccepted = action === "accept";
  const formattedDate = adminDate
    ? new Date(adminDate).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
    : null;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: isAccepted
      ? `🎉 Delivery Date Confirmed - Order #${orderId} | Khakhra Co.`
      : `💛 About Your Delivery Request - Order #${orderId} | Khakhra Co.`,
    html: isAccepted ? `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #f97316, #f59e0b); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
          <div style="font-size: 52px;">🎉</div>
          <h2 style="color: white; margin: 8px 0 0;">Your Delivery Date is Confirmed!</h2>
        </div>
        <div style="background: #fff; padding: 30px; border: 1px solid #f3f4f6; border-top: none; border-radius: 0 0 12px 12px;">
          <p>Dear <strong>${name}</strong>,</p>
          <p style="color: #374151; line-height: 1.7;">We are absolutely delighted to confirm your delivery! Your trust means the world to us, and we promise to make sure your order arrives fresh, crispy, and full of love. 🌾</p>
          <div style="background: #fff7ed; border-radius: 12px; padding: 20px; margin: 20px 0; text-align: center; border: 2px solid #f97316;">
            <p style="margin: 0; color: #666; font-size: 13px;">Your Confirmed Delivery Date</p>
            <p style="margin: 8px 0 0; font-size: 22px; font-weight: bold; color: #f97316;">${formattedDate || "As scheduled"}</p>
            <p style="margin: 4px 0 0; color: #666; font-size: 12px;">Order #${orderId}</p>
          </div>
          <p style="color: #374151; line-height: 1.7;">We can't wait for you to enjoy every crispy bite. Thank you for being such a wonderful part of the Khakhra Co. family. Your happiness is our greatest reward! ❤️</p>
          <p style="color: #f97316; font-weight: bold;">With love & crunch,<br/>The Khakhra Co. Team 🌾</p>
        </div>
      </div>
    ` : `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #f97316, #f59e0b); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
          <div style="font-size: 52px;">💛</div>
          <h2 style="color: white; margin: 8px 0 0;">A Little Update on Your Delivery</h2>
        </div>
        <div style="background: #fff; padding: 30px; border: 1px solid #f3f4f6; border-top: none; border-radius: 0 0 12px 12px;">
          <p>Dear <strong>${name}</strong>,</p>
          <p style="color: #374151; line-height: 1.7;">We truly appreciate your trust in us and we are so grateful for your order. With a heavy heart, we need to share that we are unable to fulfill your requested delivery date for Order <strong>#${orderId}</strong>.</p>
          <div style="background: #fff7ed; border-radius: 12px; padding: 16px; margin: 20px 0; border-left: 4px solid #f97316;">
            <p style="margin: 0; font-weight: bold; color: #374151;">Reason:</p>
            <p style="margin: 8px 0 0; color: #666;">${reason || "Due to high order volume, we are unable to accommodate your requested date. We sincerely apologize for any inconvenience."}</p>
          </div>
          ${formattedDate ? `
          <div style="background: #f0fdf4; border-radius: 12px; padding: 20px; margin: 20px 0; text-align: center; border: 2px solid #22c55e;">
            <p style="margin: 0; color: #666; font-size: 13px;">🎉 But here's the good news! We can deliver on:</p>
            <p style="margin: 8px 0 0; font-size: 22px; font-weight: bold; color: #22c55e;">${formattedDate}</p>
            <p style="margin: 4px 0 0; color: #666; font-size: 12px;">We hope this works for you!</p>
          </div>` : ""}
          <p style="color: #374151; line-height: 1.7;">Your satisfaction is our top priority. If you have any questions, please don't hesitate to reach out. We are always here for you. 🌾</p>
          <p style="color: #f97316; font-weight: bold;">With warmth & apologies,<br/>The Khakhra Co. Team 🌾</p>
        </div>
      </div>
    `,
  });
};
