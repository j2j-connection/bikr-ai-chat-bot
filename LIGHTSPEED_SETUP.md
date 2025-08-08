# Lightspeed Integration Setup

This guide will help you set up the Lightspeed OAuth2 integration for BikeBot.

## Prerequisites

1. **Lightspeed Retail (X-Series) Account**: You need an active Lightspeed Retail account with admin access
2. **Lightspeed Add-on Registration**: Register your application as a Lightspeed add-on

## Step 1: Register Your Add-on with Lightspeed

1. Contact Lightspeed support or use their developer portal to register your add-on
2. You'll receive:
   - **Client ID**: Your unique application identifier
   - **Client Secret**: Your application's secret key
3. Configure your callback URL as: `https://yourdomain.com/lightspeed/callback`

## Step 2: Environment Configuration

Create a `.env.local` file in your project root with the following variables:

```env
# Lightspeed OAuth Configuration
VITE_LIGHTSPEED_CLIENT_ID=your_client_id_from_step_1
VITE_LIGHTSPEED_CLIENT_SECRET=your_client_secret_from_step_1
VITE_LIGHTSPEED_CALLBACK_URL=http://localhost:5173/lightspeed/callback

# For production, update the callback URL:
# VITE_LIGHTSPEED_CALLBACK_URL=https://yourdomain.com/lightspeed/callback
```

## Step 3: Testing the Integration

1. Start your development server: `npm run dev`
2. Navigate to the Dashboard: `http://localhost:5173/dashboard`
3. Click "Connect Store" in the Lightspeed Integration card
4. Enter your store's domain prefix (the part before `.retail.lightspeed.app`)
5. You'll be redirected to Lightspeed for authentication
6. Log in with your admin credentials and authorize the application
7. You'll be redirected back to BikeBot with a successful connection

## Step 4: Using Postman for Testing (Alternative)

If you want to test the OAuth flow manually using Postman:

1. **Create Environment**: Set `domain_prefix` variable to your store prefix
2. **Create Request**: GET `https://{{domain_prefix}}.retail.lightspeed.app/api/2.0/retailer`
3. **Configure OAuth 2.0**:
   - Grant Type: Authorization Code
   - Callback URL: Your configured callback URL
   - Auth URL: `https://secure.retail.lightspeed.app/connect`
   - Access Token URL: `https://{{domain_prefix}}.retail.lightspeed.app/api/1.0/token`
   - Client ID: Your client ID
   - Client Secret: Your client secret
   - Scope: [blank]
   - State: Random string for security

## Features Enabled by Integration

Once connected, BikeBot can:

### Customer Data Access
- Look up customer service history
- Access previous bike service records
- View customer contact information

### Inventory Integration
- Check part availability in real-time
- View product categories and details
- Access pricing information

### Enhanced Diagnostics
- Cross-reference symptoms with previous service records
- Suggest parts based on inventory availability
- Create service estimates with accurate pricing

## API Endpoints Available

The integration provides access to these Lightspeed API endpoints:

- `GET /retailer` - Store information
- `GET /customers` - Customer database
- `GET /items` - Inventory items
- `GET /categories` - Product categories
- `GET /sales` - Sales history
- `POST /sales` - Create new sales (if permissions allow)

## Security Notes

- Tokens are stored securely in localStorage
- Automatic token refresh prevents expired sessions
- State parameter prevents CSRF attacks
- All API requests use HTTPS

## Troubleshooting

### Connection Issues
- Verify your Client ID and Client Secret
- Check that your callback URL matches exactly
- Ensure your domain prefix is correct (no https:// or .retail.lightspeed.app)

### Token Expiration
- The integration automatically refreshes expired tokens
- If refresh fails, users will be prompted to re-authenticate

### API Errors
- Check browser console for detailed error messages
- Verify your Lightspeed account has necessary permissions
- Ensure your add-on is approved and active

## Development vs Production

### Development
- Use `http://localhost:5173/lightspeed/callback` as callback URL
- Test with your development Lightspeed store

### Production
- Update callback URL to your production domain
- Use environment variables for sensitive configuration
- Test thoroughly with your production Lightspeed store

## Support

For Lightspeed API issues:
- Check the [Lightspeed API Documentation](https://developers.lightspeedhq.com/)
- Contact Lightspeed Developer Support

For BikeBot integration issues:
- Check the browser console for error messages
- Review the network tab for API request details
- Verify your environment configuration 