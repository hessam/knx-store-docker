# 🔍 Debug Workflow Guide - Identify Vercel Issues

## 🎯 Purpose

We've created two debug workflows to help identify exactly what's going wrong with the Vercel deployment:

1. **Debug Vercel Setup** - Comprehensive testing of all Vercel components
2. **Test Deployment** - Simple deployment test

## 📋 How to Run Debug Workflows

### **Step 1: Access GitHub Actions**

1. Go to your GitHub repository: `https://github.com/hessam/knx-store-docker`
2. Click on the **Actions** tab
3. You'll see three workflows:
   - **Simple Deployment** (automatic)
   - **Debug Vercel Setup** (manual)
   - **Test Deployment** (manual)

### **Step 2: Run Debug Vercel Setup**

1. Click on **"Debug Vercel Setup"** workflow
2. Click the **"Run workflow"** button (blue button)
3. Select the branch: `test-preview-deployment`
4. Click **"Run workflow"**

### **Step 3: Run Test Deployment**

1. Click on **"Test Deployment"** workflow
2. Click the **"Run workflow"** button
3. Select the branch: `test-preview-deployment`
4. Click **"Run workflow"**

## 🔍 What Each Workflow Tests

### **Debug Vercel Setup** - Comprehensive Testing

#### **1. Secret Availability Check**
- ✅ Verifies `VERCEL_TOKEN` exists and has correct format
- ✅ Verifies `VERCEL_ORG_ID` exists
- ✅ Verifies `VERCEL_PROJECT_ID` exists
- ❌ **If fails**: Secrets are missing or incorrectly configured

#### **2. Vercel Authentication Test**
- ✅ Tests if the token can authenticate with Vercel
- ✅ Verifies token permissions
- ❌ **If fails**: Token is expired, wrong format, or lacks permissions

#### **3. Project Access Test**
- ✅ Tests if token can access the organization
- ✅ Lists available projects
- ❌ **If fails**: Token doesn't have access to the organization

#### **4. Specific Project Test**
- ✅ Tests access to the specific project
- ✅ Verifies project ID is correct
- ❌ **If fails**: Project ID is wrong or project doesn't exist

#### **5. Build Process Test**
- ✅ Tests npm install
- ✅ Tests npm run build
- ✅ Verifies build output exists
- ❌ **If fails**: Build process has issues

#### **6. Manual Deployment Test**
- ✅ Tests actual deployment using Vercel CLI
- ✅ Uses the same commands as the action
- ❌ **If fails**: Identifies the exact deployment issue

### **Test Deployment** - Simple Deployment Test

- ✅ Tests the exact same workflow as the main deployment
- ✅ Uses `amondnet/vercel-action@v25`
- ✅ Shows preview URL and deployment URL
- ❌ **If fails**: Issue is in the action configuration

## 📊 Expected Results

### **If Everything Works:**
```
✅ VERCEL_TOKEN exists (length: 64)
✅ VERCEL_ORG_ID exists: team_XXXXX
✅ VERCEL_PROJECT_ID exists: prj_XXXXX
✅ Authentication successful!
✅ Project access successful!
✅ Build successful!
✅ Manual deployment successful!
```

### **If There Are Issues:**
The workflow will show exactly where the problem is:
- ❌ **Secret missing**: Add the missing secret
- ❌ **Authentication failed**: Check token validity
- ❌ **Project access failed**: Check organization ID
- ❌ **Build failed**: Check build configuration
- ❌ **Deployment failed**: Check project settings

## 🚨 Common Issues and Solutions

### **Issue 1: VERCEL_TOKEN Missing**
```
❌ VERCEL_TOKEN is missing
```
**Solution**: Add the token to GitHub secrets

### **Issue 2: Authentication Failed**
```
❌ Authentication failed!
```
**Solutions**:
1. Check if token is expired
2. Generate new token from Vercel dashboard
3. Verify token format

### **Issue 3: Project Access Failed**
```
❌ Cannot access projects
```
**Solutions**:
1. Check if `VERCEL_ORG_ID` is correct
2. Verify token has access to the organization
3. Check organization permissions

### **Issue 4: Build Failed**
```
❌ Build failed
```
**Solutions**:
1. Check package.json dependencies
2. Verify build script works locally
3. Check for missing files

### **Issue 5: Deployment Failed**
```
❌ Manual deployment failed!
```
**Solutions**:
1. Check project settings in Vercel
2. Verify project is properly configured
3. Check for deployment restrictions

## 🎯 Next Steps After Running Debug

### **If Debug Passes:**
1. ✅ **All components work** - Issue is in main workflow
2. **Check main workflow** - Compare with test workflow
3. **Fix workflow configuration** - Update main workflow

### **If Debug Fails:**
1. **Fix the specific issue** - Based on error message
2. **Re-run debug** - Verify fix works
3. **Then test deployment** - Run test deployment

## 📞 Reporting Results

After running the debug workflows, report back with:

1. **Which workflow you ran**
2. **What the results were** (success/failure)
3. **Any specific error messages**
4. **Which step failed** (if any)

This will help us identify the exact issue and fix it quickly!

---

**Status**: 🟢 **DEBUG WORKFLOWS READY**
**Next Action**: Run "Debug Vercel Setup" workflow
**Goal**: Identify the exact deployment issue 