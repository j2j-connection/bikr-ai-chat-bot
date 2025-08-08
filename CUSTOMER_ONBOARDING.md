# BikeBot Customer Onboarding: Integrating with Your Lightspeed Store

## Overview

This guide walks bike shop owners through the process of integrating BikeBot AI Diagnostics with their existing Lightspeed Retail store. The integration enhances your diagnostic capabilities by connecting BikeBot to your customer history, inventory, and service records.

---

## 🏪 What You Need to Get Started

### Your Lightspeed Store Requirements
- **Lightspeed Retail (X-Series)** - Must be X-Series, not Classic
- **Admin access** to your Lightspeed account
- **Active subscription** with your store operational
- **Customer database** with service history (recommended)
- **Bike inventory** properly categorized in Lightspeed

### What BikeBot Provides
- AI-powered bike diagnostics
- Integration with your existing Lightspeed data
- Enhanced customer service workflow
- Automated service estimates

---

## 📋 Step-by-Step Onboarding Process

### Step 1: Initial Setup (5 minutes)
**What you do:**
1. **Contact BikeBot** to request Lightspeed integration
2. **Provide your store information:**
   - Store name and location
   - Lightspeed domain prefix (e.g., "mybikeshop" from mybikeshop.retail.lightspeed.app)
   - Primary contact email and phone
   - Estimated go-live date

**What BikeBot does:**
- Creates your integration profile
- Registers OAuth application with Lightspeed
- Provides you with connection credentials
- Schedules onboarding call

### Step 2: Lightspeed Store Preparation (30-60 minutes)
**Before BikeBot can connect, ensure your Lightspeed store has:**

#### ✅ **Customer Database Ready**
- Import existing customers with complete contact info
- Include service history in customer notes
- Verify email addresses are accurate (BikeBot uses email for lookup)

#### ✅ **Bike Inventory Properly Organized**
Your inventory should include these categories:
```
🚴 Bicycles
  - Road Bikes, Mountain Bikes, Hybrid Bikes, E-Bikes

🔧 Components  
  - Brakes, Drivetrain, Wheels, Frame Parts

🛠️ Services
  - Tune-ups, Brake Service, Gear Adjustment, Repairs
```

#### ✅ **Service Items Configured**
Create service items with pricing:
- Basic Tune-up ($50-100)
- Full Service ($100-200)  
- Brake Adjustment ($20-40)
- Gear Adjustment ($25-50)
- Custom diagnostic work

### Step 3: Connection & Testing (15 minutes)
**What you do:**
1. **Receive connection link** from BikeBot team
2. **Click "Connect to Lightspeed"** 
3. **Enter your domain prefix** (the part before .retail.lightspeed.app)
4. **Log into Lightspeed** when prompted
5. **Authorize BikeBot** to access your store data
6. **Confirm successful connection**

**What BikeBot accesses:**
- Customer contact information and service history
- Inventory items and availability
- Product categories and pricing
- Sales/service records (read-only)

### Step 4: Staff Training (30 minutes)
**BikeBot provides training on:**
- How to use BikeBot diagnostic interface
- Customer lookup and history review
- Interpreting AI diagnostic recommendations
- Creating service estimates from BikeBot suggestions
- Managing the enhanced workflow

### Step 5: Go Live (Immediate)
**You're ready to use BikeBot when:**
- ✅ Connection shows "Connected" status
- ✅ Customer lookup returns your existing customers
- ✅ Inventory search shows your bike parts
- ✅ Staff comfortable with new workflow

---

## 🚴 How the Integration Works

### Enhanced Customer Experience
**Before BikeBot:**
1. Customer describes bike problem
2. Technician manually diagnoses
3. Estimates based on memory/experience
4. May miss previous service history

**With BikeBot Integration:**
1. **Customer describes symptoms** → BikeBot AI analyzes
2. **Email lookup** → Instantly shows service history from Lightspeed
3. **AI cross-references** → "Last brake service was 8 months ago"
4. **Parts check** → "Brake pads in stock, $25.99"
5. **Instant estimate** → "Brake pad replacement: $45 total (20 min)"
6. **Service booking** → Creates estimate in Lightspeed

### What Your Staff Will See
- **Customer lookup by email/phone** shows Lightspeed history
- **AI diagnostic suggestions** reference your actual inventory
- **Service estimates** use your Lightspeed pricing
- **Previous service notes** help identify recurring issues

---

## 💰 Pricing & Plans

### Integration Setup
- **One-time setup fee**: $X (includes Lightspeed OAuth setup)
- **Monthly subscription**: $X/month per location
- **Staff training**: Included in setup

### What's Included
- Lightspeed OAuth integration
- Unlimited AI diagnostics
- Customer history access
- Inventory integration
- Service estimate generation
- Phone and email support

---

## 🔒 Data Security & Privacy

### Your Data Stays Secure
- **No data leaves Lightspeed** - BikeBot only accesses during active sessions
- **OAuth2 security** - Industry standard authentication
- **Read-only access** - BikeBot cannot modify your Lightspeed data
- **Automatic token refresh** - No manual re-authorization needed

### What BikeBot Stores
- **Connection tokens only** - No customer or inventory data stored permanently
- **Diagnostic session logs** - For improving AI recommendations
- **Usage analytics** - Aggregated, non-identifiable data only

---

## 🛠️ Support & Maintenance

### Ongoing Support
- **Phone support** during business hours
- **Email support** with 24-hour response
- **Integration monitoring** - We'll alert you to any connection issues
- **Regular updates** - New features and AI improvements

### What We Handle
- Lightspeed API updates and changes
- OAuth token management and renewal
- Security patches and updates
- Performance monitoring and optimization

### What You Handle
- Keeping Lightspeed store data current
- Staff training on new features
- Customer communication about enhanced service

---

## 📞 Getting Started

### Ready to Integrate?
**Contact Information:**
- **Email**: support@bikebot.ai
- **Phone**: (555) 123-BIKE
- **Website**: www.bikebot.ai/lightspeed

### Next Steps
1. **Schedule consultation** - 15-minute call to discuss your needs
2. **Receive setup timeline** - Typically 1-3 business days
3. **Complete store preparation** - Using our checklist
4. **Connect and train** - 1-hour onboarding session
5. **Go live** - Start using enhanced diagnostics immediately

### Questions?
**Common Questions:**
- "How long does setup take?" → 1-3 business days after store prep
- "Will this disrupt our current workflow?" → No, BikeBot enhances existing processes
- "What if we change our Lightspeed setup?" → Integration automatically adapts
- "Can we disconnect if needed?" → Yes, one-click disconnect anytime

---

## 🎯 Success Stories

*"BikeBot cut our diagnostic time in half. Being able to see a customer's service history instantly while the AI analyzes their problem has transformed our service department."*
- **Mike's Bike Shop**, Portland, OR

*"The inventory integration is a game-changer. BikeBot tells us exactly what parts we have in stock for each repair, and customers love getting accurate estimates immediately."*
- **City Cycles**, Austin, TX

---

**Ready to revolutionize your bike service with AI-powered diagnostics?**  
**Contact BikeBot today to start your Lightspeed integration!** 

---

## 🌐 Website Integration (Floating Chat Bubble)

Add BikeBot to your website with a floating chat bubble that opens an embedded iframe.

### 1) Paste this snippet before </body>

```html
<script>
  (function () {
    var w = 420, h = 650;
    var btn = document.createElement('div');
    btn.style.cssText = 'position:fixed;bottom:20px;right:20px;background:#10b981;color:#fff;'
      + 'width:56px;height:56px;border-radius:9999px;display:flex;align-items:center;'
      + 'justify-content:center;cursor:pointer;box-shadow:0 10px 25px rgba(0,0,0,.15);z-index:999999;';
    btn.innerHTML = '💬';
    document.body.appendChild(btn);

    var wrap = document.createElement('div');
    wrap.style.cssText = 'position:fixed;bottom:88px;right:20px;width:'+w+'px;height:'+h+'px;'
      + 'border-radius:14px;overflow:hidden;box-shadow:0 15px 40px rgba(0,0,0,.2);'
      + 'display:none;background:#fff;z-index:999998;';

    var iframe = document.createElement('iframe');
    iframe.src = 'https://YOUR-BOT-DOMAIN.com/?shop=YOUR_DOMAIN_PREFIX&embed=1';
    iframe.style.cssText = 'width:100%;height:100%;border:0;';
    iframe.allow = 'clipboard-write; microphone; camera';
    wrap.appendChild(iframe);
    document.body.appendChild(wrap);

    btn.onclick = function(){
      wrap.style.display = (wrap.style.display==='none' || !wrap.style.display) ? 'block' : 'none';
    };
  })();
</script>
```

Replace:
- `YOUR-BOT-DOMAIN.com` with your BikeBot hosted domain
- `YOUR_DOMAIN_PREFIX` with your Lightspeed domain prefix (e.g., `mystore` from mystore.retail.lightspeed.app)

### 2) Where to add it
- WordPress: Appearance → Theme File Editor → `footer.php` (before `</body>`), or use a “Custom HTML” block on the specific page.
- Shopify: Online Store → Themes → Edit Code → `layout/theme.liquid` (before `</body>`), or add a “Custom Liquid/HTML” section to the desired template.
- Squarespace / Wix / Webflow: Add an “Embed/HTML” block to the site footer or target page and paste the snippet.

### 3) Security/CSP notes
- If you use a strict Content-Security-Policy, allow frame embedding for your bot domain: `frame-src https://YOUR-BOT-DOMAIN.com;` and `connect-src` as needed.
- Ensure your site does not set `X-Frame-Options: DENY` for the bot domain.
- All requests are over HTTPS.

### 4) Optional theming
- You can append query params for simple branding, e.g. `&brand=YourShop&theme=light` and read them in your hosted bot if supported.

This approach lets you deploy BikeBot on any CMS or custom site with a single snippet, while keeping Lightspeed OAuth and data access managed in your BikeBot dashboard. 