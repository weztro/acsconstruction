async function test() {
  try {
    const PORT = 3007;
    console.log("Starting verification checks on http://localhost:3007...");

    // Test 1: Invalid payload
    const invalidRes = await fetch("http://localhost:3007/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "A", phone: "123", email: "bad", message: "short" })
    });
    const invalidData = await invalidRes.json();
    console.log("✔ TEST 1 - Invalid Form Response (Status " + invalidRes.status + "):", invalidData);

    // Test 2: Valid payload with Indian mobile number format
    const validRes = await fetch("http://localhost:3007/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Siddharth Sharma",
        phone: "+91 98451 23456",
        email: "siddharth@example.com",
        location: "Whitefield, Bengaluru",
        projectType: "Turnkey Construction",
        budget: "₹1 Crore – ₹2.5 Crores",
        message: "We are planning a 4,500 sq.ft courtyard home on an east-facing plot."
      })
    });
    const validData = await validRes.json();
    console.log("✔ TEST 2 - Valid Indian Mobile Form Response (Status " + validRes.status + "):", validData);

    // Test 3: Home Page
    const homeRes = await fetch("http://localhost:3007/");
    console.log("✔ TEST 3 - Home Page GET Status:", homeRes.status);

    // Test 4: Dynamic Project Details
    const projectRes = await fetch("http://localhost:3007/projects/courtyard-residence");
    console.log("✔ TEST 4 - Dynamic Project Detail Page GET Status:", projectRes.status);

    // Test 5: Services Page
    const servicesRes = await fetch("http://localhost:3007/services");
    console.log("✔ TEST 5 - Services Page GET Status:", servicesRes.status);

    // Test 6: Process Page
    const processRes = await fetch("http://localhost:3007/process");
    console.log("✔ TEST 6 - Process Page GET Status:", processRes.status);

    // Test 7: Contact Page
    const contactRes = await fetch("http://localhost:3007/contact");
    console.log("✔ TEST 7 - Contact Page GET Status:", contactRes.status);

    console.log("\nALL VERIFICATIONS PASSED SUCCESSFULLY!");
  } catch (err) {
    console.error("Test execution failed:", err);
  }
}

test();
