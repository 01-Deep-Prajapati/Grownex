import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/user.js";
import Post from "../models/post.js";
import dotenv from "dotenv";

dotenv.config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB...");

    // Clear existing data
    await User.deleteMany({});
    await Post.deleteMany({});
    console.log("Cleared existing data...");

    // Create users
    const hashedPassword = await bcrypt.hash("password123", 10);

    const users = [
      {
        name: "John Developer",
        email: "john@example.com",
        password: hashedPassword,
        title: "Senior Full Stack Developer",
        bio: "Passionate about web development and open source. Love building scalable applications and mentoring junior developers.",
        location: "San Francisco, CA",
        profileImage:
          "https://res.cloudinary.com/dffkavugz/image/upload/v1757526876/samples/man-portrait.jpg", // Add Cloudinary URL here
      },
      {
        name: "Sarah Designer",
        email: "sarah@example.com",
        password: hashedPassword,
        title: "UI/UX Designer",
        bio: "Creating beautiful and intuitive user experiences. Specialized in mobile app design and brand identity.",
        location: "New York, NY",
        profileImage:
          "https://res.cloudinary.com/dffkavugz/image/upload/v1757526878/cld-sample.jpg", // Add Cloudinary URL here
      },
      {
        name: "Mike Product",
        email: "mike@example.com",
        password: hashedPassword,
        title: "Product Manager",
        bio: "Building products that solve real problems. Experience in agile methodologies and team leadership.",
        location: "Seattle, WA",
        profileImage:
          "https://res.cloudinary.com/dffkavugz/image/upload/v1757526875/samples/smile.jpg", // Add Cloudinary URL here
      },
    ];

    const createdUsers = await User.insertMany(users);
    console.log("Users created...");

    // Create posts
    const posts = [
      {
        userId: createdUsers[0]._id, // John's post
        content:
          "Just launched a new React project using Next.js and TailwindCSS! The developer experience is amazing. Would love to hear your thoughts on this stack. #webdev #react #nextjs",
        media: {
          url: "https://res.cloudinary.com/dffkavugz/image/upload/v1762694527/published-a-npm-package-to-simplify-api-responses-with-v0-g6w8vmcwd0ud1_nr6np7.png", // Add Cloudinary URL here
          type: "image",
        },
        likes: [createdUsers[1]._id, createdUsers[2]._id],
        createdAt: new Date("2025-11-08T10:00:00Z"),
      },
      {
        userId: createdUsers[1]._id, // Sarah's post
        content:
          "Here's my latest UI design for a fintech app. Focused on making complex financial data more accessible and visually appealing. What do you think about the color scheme? #uidesign #fintech",
        media: {
          url: "https://res.cloudinary.com/dffkavugz/image/upload/v1762694578/original-3632fddd9c6a0fd99b661a62dcfa64dc_kocolk.png", // Add Cloudinary URL here
          type: "image",
        },
        likes: [createdUsers[0]._id],
        createdAt: new Date("2025-11-08T11:30:00Z"),
      },
      {
        userId: createdUsers[2]._id, // Mike's post
        content:
          "Excited to share our team's latest product launch! Six months of hard work has paid off. Special thanks to everyone who contributed to making this happen. 🚀",
        media: {
          url: "https://res.cloudinary.com/dffkavugz/image/upload/v1762694645/Screenshot-2025-04-01-at-22.05.35-1-1_iaqzbd.png", // Add Cloudinary URL here
          type: "image",
        },
        likes: [createdUsers[0]._id, createdUsers[1]._id],
        createdAt: new Date("2025-11-08T14:15:00Z"),
      },
      {
        userId: createdUsers[0]._id, // John's second post
        content:
          "Quick tip: Use the new CSS :has() selector to create more dynamic layouts without JavaScript. Here's a simple example I made. #css #webdev",
        media: {
          url: "https://res.cloudinary.com/dffkavugz/image/upload/v1762694645/Screenshot-2025-04-01-at-22.05.35-1-1_iaqzbd.png", // Add Cloudinary URL here
          type: "image",
        },
        likes: [createdUsers[1]._id],
        createdAt: new Date("2025-11-09T09:20:00Z"),
      },
      {
        userId: createdUsers[1]._id, // Sarah's second post
        content:
          "Design resources that every UI/UX designer should know about:\n\n1. Figma Auto Layout\n2. Material Design 3\n3. Apple's Human Interface Guidelines\n4. Tailwind UI\n5. Coolors for color palettes\n\nWhat are your go-to design resources? #design #ux",
        likes: [createdUsers[0]._id, createdUsers[2]._id],
        createdAt: new Date("2025-11-09T13:45:00Z"),
      },
      {
        userId: createdUsers[2]._id, // Mike's second post
        content:
          "Just wrapped up our quarterly product strategy meeting. Key focus areas for Q4:\n\n• AI-driven features\n• Performance optimization\n• Mobile-first approach\n• User engagement\n\nExciting times ahead! 📈 #productmanagement",
        likes: [createdUsers[0]._id],
        createdAt: new Date("2025-11-09T15:30:00Z"),
      },
    ];

    await Post.insertMany(posts);
    console.log("Posts created...");

    console.log("Seed data inserted successfully!");
    console.log("You can now log in with any of these emails:");
    console.log("- john@example.com");
    console.log("- sarah@example.com");
    console.log("- mike@example.com");
    console.log("Password for all accounts: password123");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

seedData();
