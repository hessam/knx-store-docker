# Mob Programming Guidelines

## Overview
Mob programming is a collaborative development practice where the entire team works on the same task at the same time, at the same computer. This document outlines our mob programming setup and guidelines.

## Schedule
- **Frequency**: 3x per week (Monday, Wednesday, Friday)
- **Duration**: 2 hours per session
- **Time**: 10:00 AM - 12:00 PM EST
- **Focus**: Complex features, API integrations, architectural decisions

## Roles & Responsibilities

### Driver (Coder)
- **Duration**: 15 minutes per rotation
- **Responsibilities**:
  - Types code as directed by the Navigator
  - Asks questions when unclear about implementation
  - Focuses on syntax and immediate implementation details
  - Does not make architectural decisions

### Navigator (Guide)
- **Duration**: 15 minutes per rotation
- **Responsibilities**:
  - Provides direction and guidance to the Driver
  - Makes architectural and design decisions
  - Explains the "why" behind implementation choices
  - Ensures code quality and best practices

### Observers (Contributors)
- **Responsibilities**:
  - Contribute ideas and suggestions
  - Catch potential issues or improvements
  - Ask clarifying questions
  - Document decisions and learnings

## Rotation Schedule
- **Switch every 15 minutes**
- **Clockwise rotation**: Driver → Navigator → Observer
- **Timer**: Use a visible timer (phone, computer, or physical timer)
- **Announcement**: "Time to rotate!" when timer goes off

## Tools & Setup

### Remote Collaboration
- **VS Code Live Share**: Primary coding environment
- **Zoom/Slack**: Video and chat communication
- **Shared Google Doc**: Notes and decisions documentation
- **Timer**: Visible countdown for rotations

### Physical Setup (if in-person)
- **Large monitor**: 27" or larger for code visibility
- **Wireless keyboard/mouse**: Easy handoff between team members
- **Whiteboard**: Architecture diagrams and notes
- **Timer**: Visible countdown for rotations

## Best Practices

### Before the Session
1. **Clear Objective**: Define what you want to accomplish
2. **Environment Setup**: Ensure all tools are working
3. **Role Assignment**: Determine initial Driver and Navigator
4. **Time Box**: Set realistic goals for the 2-hour session

### During the Session
1. **Stay Focused**: One task at a time
2. **Ask Questions**: Don't assume - clarify when unsure
3. **Take Breaks**: 5-minute break every hour
4. **Document Decisions**: Record important architectural choices
5. **Include Everyone**: Ensure all voices are heard

### After the Session
1. **Review Progress**: What was accomplished?
2. **Document Learnings**: What worked well? What could improve?
3. **Plan Next Steps**: What needs to happen next?
4. **Share Knowledge**: Update team documentation

## Common Challenges & Solutions

### Challenge: Dominant Personalities
**Solution**: 
- Use timer to ensure equal participation
- Explicitly ask quieter team members for input
- Rotate roles frequently

### Challenge: Technical Disagreements
**Solution**:
- Time-box discussions (5-10 minutes max)
- Make a decision and move forward
- Document the disagreement for later review
- Use "disagree and commit" principle

### Challenge: Slow Progress
**Solution**:
- Break down tasks into smaller pieces
- Focus on one thing at a time
- Don't get stuck on perfect solutions
- Remember: working code is better than perfect code

## Session Templates

### Complex Feature Development
1. **Planning** (15 min): Architecture discussion
2. **Implementation** (90 min): Coding with rotations
3. **Review** (15 min): Code review and next steps

### Bug Fixing
1. **Investigation** (30 min): Understand the problem
2. **Solution Design** (30 min): Plan the fix
3. **Implementation** (45 min): Code the fix
4. **Testing** (15 min): Verify the solution

### Code Review
1. **Setup** (15 min): Understand the PR
2. **Review** (90 min): Line-by-line review with rotations
3. **Action Items** (15 min): Document required changes

## Success Metrics
- **Participation**: All team members actively contribute
- **Learning**: Team members learn from each other
- **Quality**: Code quality improves through collaboration
- **Speed**: Complex features are completed faster
- **Knowledge Sharing**: Knowledge is distributed across the team

## Resources
- [Mob Programming Guide](https://mobprogramming.org/)
- [VS Code Live Share Documentation](https://docs.microsoft.com/en-us/visualstudio/liveshare/)
- [Effective Remote Mob Programming](https://www.remotemobprogramming.org/)

## Contact
For questions or suggestions about mob programming setup, contact the team lead or create an issue in the project repository. 