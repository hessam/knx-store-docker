# 🔗 **Slack Integration Setup Guide**

## 📋 **Overview**

This guide explains how to set up Slack integration for GitHub Actions to enable automated notifications for build status and PR reviews.

## 🚀 **Quick Setup**

### **1. Create a Slack App**

1. Go to [Slack API Apps](https://api.slack.com/apps)
2. Click **"Create New App"**
3. Choose **"From scratch"**
4. Name your app (e.g., "KNX Store GitHub Bot")
5. Select your workspace

### **2. Configure Bot Token Scopes**

1. Go to **"OAuth & Permissions"** in the left sidebar
2. Under **"Scopes"** → **"Bot Token Scopes"**, add:
   - `chat:write` - Send messages to channels
   - `chat:write.public` - Send messages to public channels
   - `channels:read` - View basic channel info
   - `users:read` - View basic user info

### **3. Install App to Workspace**

1. Go to **"Install App"** in the left sidebar
2. Click **"Install to Workspace"**
3. Authorize the app

### **4. Get Bot Token**

1. After installation, go back to **"OAuth & Permissions"**
2. Copy the **"Bot User OAuth Token"** (starts with `xoxb-`)

### **5. Add Token to GitHub Secrets**

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **"New repository secret"**
4. Name: `SLACK_BOT_TOKEN`
5. Value: Paste your bot token (e.g., `xoxb-your-token-here`)

### **6. Invite Bot to Channels**

In Slack, invite your bot to the channels where you want notifications:

```
/invite @your-bot-name
```

**Required channels:**
- `#team-updates` - Build status notifications
- `#code-reviews` - PR review notifications

## 🔧 **Enable Slack Notifications**

### **Option 1: Enable in Workflows (Recommended)**

Once you've added the `SLACK_BOT_TOKEN` secret, the workflows will automatically use Slack notifications.

### **Option 2: Manual Enable**

If you want to manually enable/disable Slack notifications:

1. Edit `.github/workflows/simple-deploy.yml`
2. Replace the echo statements with the Slack action:

```yaml
- name: Notify Team on Success
  if: success()
  uses: slackapi/slack-github-action@v1.24.0
  with:
    payload: |
      {
        "channel": "team-updates",
        "text": "✅ **Build & Test Success** \n*Repository:* ${{ github.repository }}\n*Branch:* ${{ github.ref_name }}\n*Commit:* ${{ github.sha }}\n*Triggered by:* ${{ github.actor }}\n\n🚀 **Quality Gates Passed:**\n• Bundle size: ✅ Under limit\n• Accessibility: ✅ No violations\n• Lighthouse CI: ✅ 95+ scores\n\n📊 **Next Steps:**\n• Vercel auto-deployment in progress\n• Ready for code review\n• PR review time target: <2 hours"
      }
  env:
    SLACK_BOT_TOKEN: ${{ secrets.SLACK_BOT_TOKEN }}
```

## 📊 **Notification Types**

### **Build & Test Notifications**

- **Success**: Sent to `#team-updates`
- **Failure**: Sent to `#team-updates`
- **Triggers**: On push to main/develop branches

### **PR Review Notifications**

- **New PR**: Sent to `#code-reviews`
- **Reviewers**: Automatically assigned based on CODEOWNERS
- **Targets**: <2 hours review time, <24 hours merge time

## 🛠️ **Troubleshooting**

### **Common Issues**

1. **"Need to provide at least one botToken or webhookUrl"**
   - Ensure `SLACK_BOT_TOKEN` is set in GitHub Secrets
   - Check that the token starts with `xoxb-`

2. **"Channel not found"**
   - Ensure the bot is invited to the channel
   - Check channel name spelling (case-sensitive)

3. **"Permission denied"**
   - Verify bot has required scopes
   - Check that bot is installed to workspace

### **Testing Slack Integration**

1. Create a test PR
2. Check GitHub Actions logs for Slack notifications
3. Verify messages appear in Slack channels

## 🔒 **Security Best Practices**

1. **Never commit tokens** to version control
2. **Use repository secrets** for sensitive data
3. **Rotate tokens** periodically
4. **Limit bot permissions** to minimum required scopes

## 📈 **Monitoring**

### **Success Metrics**

- ✅ Build notifications sent successfully
- ✅ PR review notifications working
- ✅ Reviewer assignment automated
- ✅ Team response times improved

### **Key Performance Indicators**

- **PR Review Time**: Target <2 hours
- **Merge Time**: Target <24 hours
- **Notification Delivery**: 100% success rate
- **Team Engagement**: Increased participation

## 🔗 **Useful Links**

- [Slack API Documentation](https://api.slack.com/)
- [GitHub Actions Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Slack GitHub Action](https://github.com/slackapi/slack-github-action)

---

**Status**: ✅ **Ready for Setup**  
**Last Updated**: [Current Date]  
**Version**: 1.0 