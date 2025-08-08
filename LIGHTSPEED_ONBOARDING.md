# BikeBot + Lightspeed Integration: Complete Onboarding Guide

## Overview

BikeBot integrates with Lightspeed Retail (X-Series) to provide enhanced bike diagnostic services by accessing customer history, inventory data, and creating service estimates. This guide covers everything needed to successfully onboard and configure your Lightspeed store for BikeBot integration.

## 🏪 Prerequisites & Account Requirements

### Lightspeed Account Requirements
- **Lightspeed Retail (X-Series)** subscription (not Classic)
- **Admin/Owner permissions** on your Lightspeed account
- **Active subscription** with API access enabled
- **Store must be operational** with basic setup complete

### Technical Requirements
- Domain with HTTPS (for production)
- Ability to register OAuth applications
- Basic understanding of API integrations

---

## 📋 Phase 1: Lightspeed Developer Setup

### 1.1 Register as a Lightspeed Developer
1. Visit the **Lightspeed Developer Portal**: https://developers.lightspeedhq.com/
2. Create a developer account using your business email
3. Complete developer verification process
4. Access the **Add-on Management Dashboard**

### 1.2 Create Your BikeBot Add-on
1. In the developer portal, click **"Create New Add-on"**
2. Fill out application details:
   - **App Name**: "BikeBot AI Diagnostics"
   - **Description**: "AI-powered bicycle diagnostic and service management"
   - **Category**: "Business Tools" or "Inventory Management"
   - **Callback URL**: 
     - Development: `http://localhost:5173/lightspeed/callback`
     - Production: `https://yourdomain.com/lightspeed/callback`

3. **Submit for approval** (may take 1-3 business days)
4. Once approved, you'll receive:
   - **Client ID**: `FfRxhGg0bmQ5PZwpkzd4x7fOwsN6aYFQ` (example)
   - **Client Secret**: `ITJjrhYkjsOXHP9FRdEdd3HDlmlPPu7O` (example)

---

## 🏬 Phase 2: Lightspeed Store Configuration

### 2.1 Essential Store Setup

Before BikeBot can provide optimal service, your Lightspeed store must be properly configured:

#### **Customer Database**
- ✅ **Import existing customers** with complete contact information
- ✅ **Enable customer history tracking**
- ✅ **Set up customer fields**: Name, Email, Phone, Address
- ✅ **Configure customer notes** for service history

#### **Product Catalog (Critical for BikeBot)**
Your inventory must include bike-related categories and products:

**Required Categories:**
```
📁 Bicycles
  ├── Road Bikes
  ├── Mountain Bikes  
  ├── Hybrid Bikes
  └── E-Bikes

📁 Components
  ├── Brakes (Brake pads, cables, calipers)
  ├── Drivetrain (Chains, cassettes, derailleurs)
  ├── Wheels (Tires, tubes, rims, spokes)
  ├── Frame (Handlebars, stems, seatposts)
  └── Accessories (Lights, locks, pumps)

📁 Services
  ├── Basic Tune-up
  ├── Full Service
  ├── Brake Adjustment
  ├── Gear Adjustment
  └── Wheel Truing
```

#### **Service Items Setup**
Create service items for common repairs:
- **Basic Tune-up** - $75 (1 hour)
- **Full Service** - $150 (2 hours)
- **Brake Adjustment** - $25 (30 minutes)
- **Gear Adjustment** - $30 (45 minutes)
- **Wheel Truing** - $40 (45 minutes)
- **Chain Replacement** - $45 (30 minutes)

### 2.2 Payment & Tax Configuration

#### **Payment Methods**
Configure these payment types for service transactions:
- Cash
- Credit Card
- Debit Card
- Store Credit
- Insurance Claims (if applicable)

#### **Tax Setup**
- Configure local sales tax rates
- Set tax categories for parts vs. labor
- Enable tax-exempt customers (if applicable)

### 2.3 User Permissions & Staff Access

#### **API Access Permissions**
Ensure your admin account has these permissions:
- ✅ Read customers
- ✅ Read inventory/items  
- ✅ Read categories
- ✅ Read sales history
- ✅ Create sales/estimates (optional)
- ✅ Access reporting data

#### **Staff Training**
Train your staff on:
- BikeBot diagnostic workflow
- How to access customer history via BikeBot
- Creating service estimates from BikeBot recommendations

---

## ⚙️ Phase 3: BikeBot Configuration

### 3.1 Environment Setup

Create `.env.local` file in your BikeBot project:

```env
# Lightspeed OAuth Configuration
VITE_LIGHTSPEED_CLIENT_ID=FfRxhGg0bmQ5PZwpkzd4x7fOwsN6aYFQ
VITE_LIGHTSPEED_CLIENT_SECRET=ITJjrhYkjsOXHP9FRdEdd3HDlmlPPu7O
VITE_LIGHTSPEED_CALLBACK_URL=http://localhost:5173/lightspeed/callback

# For production:
# VITE_LIGHTSPEED_CALLBACK_URL=https://yourdomain.com/lightspeed/callback
```

### 3.2 Test Connection

1. Start BikeBot: `npm run dev`
2. Navigate to Dashboard: `http://localhost:5173/dashboard`
3. Click **"Connect Store"**
4. Enter your **domain prefix** (e.g., "mybikeshop" from mybikeshop.retail.lightspeed.app)
5. Complete OAuth authorization
6. Verify connection shows store name and status

---

## 🚴 Phase 4: BikeBot Integration Features

### 4.1 What BikeBot Accesses

**Customer Data:**
- Customer contact information
- Service history and previous repairs
- Purchase history for parts/bikes
- Customer notes and preferences

**Inventory Data:**
- Real-time parts availability
- Product categories and specifications
- Pricing information
- Stock levels for recommendations

**Sales Data:**
- Historical service records
- Previous diagnostic results
- Warranty information
- Service intervals

### 4.2 BikeBot Workflow Integration

**Enhanced Diagnostic Process:**
1. **Customer enters symptoms** → BikeBot AI analyzes
2. **Email/phone lookup** → Retrieves Lightspeed customer history
3. **Cross-reference history** → Identifies recurring issues
4. **Check parts availability** → Suggests in-stock solutions
5. **Generate estimate** → Creates service quote with accurate pricing
6. **Create service record** → Logs diagnostic in Lightspeed

**Customer Benefits:**
- Faster diagnostics using service history
- Accurate parts availability and pricing
- Seamless service booking
- Comprehensive service records

---

## 📊 Phase 5: Data Migration & Optimization

### 5.1 Historical Data Import

**Customer Data Migration:**
- Export customer data from existing systems
- Import into Lightspeed with complete contact info
- Include service history notes
- Map customer preferences and bike details

**Inventory Optimization:**
- Audit current parts inventory
- Categorize all bike-related products
- Set reorder points for common parts
- Update product descriptions for better search

### 5.2 Service History Enhancement

**For Existing Customers:**
- Add historical service records to customer profiles
- Include bike specifications and serial numbers
- Document recurring issues and solutions
- Set service reminders and intervals

---

## 🔧 Phase 6: Testing & Validation

### 6.1 Integration Testing Checklist

**Customer Lookup:**
- [ ] Search by email returns correct customer
- [ ] Service history displays properly
- [ ] Contact information auto-fills forms

**Inventory Integration:**
- [ ] Parts search returns relevant results
- [ ] Stock levels are accurate
- [ ] Pricing matches store pricing

**Diagnostic Workflow:**
- [ ] AI recommendations reference available parts
- [ ] Service estimates include accurate labor costs
- [ ] Customer history influences diagnostic suggestions

### 6.2 Staff Training & Validation

**Train staff on:**
- BikeBot diagnostic interface
- How to interpret AI recommendations
- Accessing customer service history
- Creating estimates from BikeBot suggestions

---

## 📚 Documentation & Support Resources

### Official Documentation
- **Lightspeed API Docs**: https://developers.lightspeedhq.com/retail/introduction
- **OAuth2 Guide**: https://developers.lightspeedhq.com/retail/authentication
- **API Reference**: https://developers.lightspeedhq.com/retail/ref

### BikeBot Integration Support
- Check browser console for error messages
- Review network tab for API request details
- Verify environment configuration
- Test with development store first

### Common Integration Points
- **Customer API**: `/api/2.0/customers` - Customer database access
- **Items API**: `/api/2.0/items` - Inventory and parts catalog
- **Categories API**: `/api/2.0/categories` - Product organization
- **Sales API**: `/api/2.0/sales` - Service history and transactions

---

## 🚀 Go-Live Checklist

### Pre-Launch
- [ ] Lightspeed store fully configured with bike inventory
- [ ] Customer database imported and verified
- [ ] Staff trained on BikeBot workflow
- [ ] Integration tested with real customer data
- [ ] Callback URLs updated for production
- [ ] SSL certificate configured for production domain

### Launch Day
- [ ] Monitor integration logs for errors
- [ ] Test customer lookups with real data
- [ ] Verify inventory sync is working
- [ ] Confirm service estimates are accurate
- [ ] Staff comfortable with new workflow

### Post-Launch
- [ ] Monitor diagnostic accuracy and customer feedback
- [ ] Track integration performance and API usage
- [ ] Regular data sync verification
- [ ] Ongoing staff training and optimization

---

## ⚠️ Important Notes

**Data Security:**
- All customer data remains in your Lightspeed account
- BikeBot only accesses data during active sessions
- OAuth tokens are securely managed and auto-refresh
- No sensitive data is stored permanently in BikeBot

**API Limitations:**
- Lightspeed API has rate limits (typically 300 requests/minute)
- Some operations require specific user permissions
- Real-time inventory sync depends on Lightspeed updates

**Support Escalation:**
- BikeBot integration issues → Check browser console and network logs
- Lightspeed API issues → Contact Lightspeed Developer Support
- OAuth/authentication issues → Verify callback URLs and credentials

This comprehensive setup ensures BikeBot can provide enhanced diagnostic services while maintaining seamless integration with your existing Lightspeed workflow. 