// Simple test to demonstrate the SDK working with our API
const { CedarlumeApiClient } = require('./packages/sdk/dist/client');

async function testSDK() {
  console.log('🧪 Testing Cedarlume SDK with running API...\n');
  
  // Create API client
  const client = new CedarlumeApiClient({
    baseUrl: 'http://localhost:3000',
    timeout: 5000
  });

  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const health = await client.get('/health');
    console.log('✅ Health check:', health.message);
    console.log('   Status:', health.status);
    console.log('   Version:', health.version);
    console.log('');

    // Test API info
    console.log('2. Testing API info...');
    const apiInfo = await client.get('/api');
    console.log('✅ API Info:', apiInfo.message);
    console.log('   Available endpoints:', Object.keys(apiInfo.endpoints).join(', '));
    console.log('');

    // Test listings endpoint
    console.log('3. Testing listings endpoint...');
    const listings = await client.get('/api/listings');
    console.log('✅ Listings found:', listings.listings.length);
    if (listings.listings.length > 0) {
      const listing = listings.listings[0];
      console.log('   Sample listing:', listing.title);
      console.log('   Type:', listing.type);
      console.log('   Location:', listing.location);
    }
    console.log('');

    // Test organizations endpoint
    console.log('4. Testing organizations endpoint...');
    const orgs = await client.get('/api/organizations');
    console.log('✅ Organizations found:', orgs.organizations.length);
    if (orgs.organizations.length > 0) {
      const org = orgs.organizations[0];
      console.log('   Sample organization:', org.name);
      console.log('   Status:', org.status);
      console.log('   Location:', org.location);
    }
    console.log('');

    // Test auth endpoint (mock)
    console.log('5. Testing auth endpoint...');
    const authResponse = await client.post('/api/auth/login', {
      email: 'demo@example.com',
      password: 'demo123'
    });
    console.log('✅ Auth response:', authResponse.message);
    console.log('   User:', authResponse.user.email);
    console.log('   Token received:', !!authResponse.token);
    console.log('');

    console.log('🎉 All SDK tests passed! The Cedarlume Marketplace is working as a POC!');
    console.log('\n📱 Next steps:');
    console.log('   - Mobile app can be tested with Expo Go app');
    console.log('   - Database is running with sample data');
    console.log('   - API endpoints are functional');
    console.log('   - SDK is ready for integration');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('   Response status:', error.response.status);
      console.error('   Response data:', error.response.data);
    }
  }
}

// Run the test
testSDK();
