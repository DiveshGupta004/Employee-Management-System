const bcrypt = require('bcryptjs');

async function testBcrypt() {
    const password = "PRA2025";
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    const match = await bcrypt.compare(password, hashed);
    console.log(`Password: ${password}, Hashed: ${hashed}, Match: ${match}`); // Should log true for Match
}

testBcrypt();
