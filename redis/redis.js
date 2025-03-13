const {createClient} =require('redis');

const redisClient = createClient({
  socket: {
    host: "127.0.0.1",
    port: 6379
  }
});

redisClient.on("error", (err) => console.error(" Redis Error:", err));

(async () => {
  await redisClient.connect();
  console.log("✅ Connected to Redis...\n");

  //  Set & Get a Value
  await redisClient.set("name", "John Doe");
  const name = await redisClient.get("name");
  console.log("📌 Stored Name:", name); // Output: John Doe


  await redisClient.setEx("sessionToken", 5, "abc123"); // Expires in 5 seconds
  console.log("🕒 Session Token Stored...");

  setTimeout(async () => {
    const expiredToken = await redisClient.get("sessionToken");
    console.log("⌛ After 6s, Session Token:", expiredToken || "Expired");
  }, 6000);

  //  Storing Objects (Hashes)
  await redisClient.hSet("user:1001", "name", "Alice", "age", "25", "role", "Admin");
  const userData = await redisClient.hGetAll("user:1001");
  console.log("👤 User Data:", userData);

  //  Working with Lists (Push & Pop)
  await redisClient.lPush("messages", "Hello", "How are you?", "Welcome!");
  const messages = await redisClient.lRange("messages", 0, -1);
  console.log("💬 Messages:", messages);

  //  Using Sets (Unique Values)
  await redisClient.sAdd("students", "Alice", "Bob", "Charlie", "Alice"); // No duplicate
  const students = await redisClient.sMembers("students");
  console.log("🎓 Students:", students);

  //  Publish/Subscribe (Real-time Messaging)
  const subscriberClient = redisClient.duplicate();
  await subscriberClient.connect();

  await subscriberClient.subscribe("updates", (message) => {
    console.log("📢 Received Update:", message);
  });

  setTimeout(async () => {
    await redisClient.publish("updates", "🔥 New update available!");
  }, 3000);

})();
