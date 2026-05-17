# Judge Lenses

Research date: 2026-05-17

Purpose: help today's Ralphthon idea-generation, implementation, and demo decisions account for the likely interests of the judges on 17 May 2026. This is not a scoring guarantee. It is a set of working hypotheses based on public profiles, public posts, and the event page.

## Event Rubric

The Luma page lists two main prize tracks:

- Impact Track: standard hackathon rubric: impact, technical execution, originality, and demo quality.
- Harness / Skills Track: judged on agent engineering, harness design, skills, spec writing, and delegation craft.

Implication: choose an idea that can be explained as both a useful product and a strong agent/harness demonstration.

## Source Access Notes

- LinkedIn public pages were partially accessible. Some direct LinkedIn pages returned rate limits, robots blocks, or login walls.
- Where recent LinkedIn posts were not directly accessible, this document uses public search snippets, X mirrors, official profiles, and company pages.
- Treat "likely lens" sections as planning heuristics, not claims about private preferences.

## Judges

### Yeachan Heo

Links:

- LinkedIn: https://www.linkedin.com/in/yeachan-heo-225b02219/
- GitHub: https://github.com/yeachan-heo
- Recent public LinkedIn post found: `oh-my-codex - Your codex is not alone`

Public signals:

- Luma describes him through large OSS agent-tooling projects: `oh-my-claudecode`, `oh-my-codex`, and `claw-code`.
- His recent LinkedIn post promotes `oh-my-codex` with the line "Don't leave Codex alone."

Likely interests:

- Agent harnesses that make coding agents more capable.
- Plugins, skills, orchestration, delegation, and automation ergonomics.
- OSS-style usefulness: clear README, composable tools, and developer adoption potential.
- Projects where the loop itself is impressive, not just the final app.

Project-shaping advice:

- Make the Ralph loop visible in the demo.
- Show how the agent was instructed, monitored, and recovered.
- Build a reusable harness, skill, evaluator, or workflow rather than only a one-off app.
- Keep the repo legible enough that another builder could fork the pattern.

### Jaewon Lee

Links:

- LinkedIn: https://www.linkedin.com/in/jaewonlee728/

Public signals:

- Luma lists him as OpenAI.
- Public LinkedIn search snippets show him resharing OpenAI Startup Meetup Seoul and being involved in a hands-on technical workshop where engineers experimented with multimodal AI workflows and real product integrations.

Likely interests:

- Practical OpenAI-powered workflows that real startups or engineering teams can adopt.
- Demos where the model is integrated into an actual product flow, not just a chat wrapper.
- Multimodal or tool-using AI that produces measurable user value.
- Clear implementation choices and credible adoption path.

Project-shaping advice:

- Tie the project to a real workflow with a before/after productivity story.
- Show concrete OpenAI/Codex usage and why the chosen model/tooling matters.
- Add a crisp "who would use this Monday morning?" answer.

### Daeyeol Shim

Links:

- LinkedIn: https://www.linkedin.com/in/shimdx/

Public signals:

- Luma lists him as OpenAI.
- Public LinkedIn snippets show recent activity around "Loopy Era", agents running loops, spec files before using Claude Code/Codex, and AI delegation beyond autocomplete.
- A public search result also shows him sharing a post about software development shifting toward issues and artifacts, harness engineering, and the next bottleneck becoming human context switching across multiple Codex sessions.

Likely interests:

- Spec-first agent work.
- Harness engineering and repeatability.
- Clear issue/artifact flow rather than vague prompting.
- Reducing human context-switching through good repo-local memory.

Project-shaping advice:

- Make `doc/interview.md`, `doc/product.md`, `doc/tickets/`, and `doc/ralph-loop.md` first-class deliverables.
- Demo the loop as a reliable engineering system, not just a prompt.
- Include evaluation gates and failure-handling notes.

### Brian Chau

Links:

- LinkedIn: https://www.linkedin.com/in/imaxblue/
- Network School profile: https://ns.com/brian

Public signals:

- Luma lists him as Network School and IOI Gold Medalist.
- Network School profile lists him as Founding Faculty and says he works across software, AI tooling, partnerships, and media.

Likely interests:

- Technical depth and algorithmic clarity.
- AI tooling that helps serious builders move faster.
- Community, education, and network-school style builder environments.
- Projects that combine software craft with distribution or media clarity.

Project-shaping advice:

- Keep the technical core nontrivial and explainable.
- Avoid hand-wavy "AI wrapper" demos.
- Show why builders would actually use this in a high-agency community.

### Soju

Links:

- X: https://x.com/0xSoju

Public signals:

- Luma lists him as Lead Meteora, internal AI taskforce lead, and co-founder of Petani.
- Recent public X mirrors show posts about Meteora product upgrades, investor reporting, LP safety, making the product "2x better", trust, long-run consistency, and retail liquidity-provider education.
- Public crypto coverage highlights his views on community choice, stakeholder alignment, and sustainable value around Meteora's token/community.

Likely interests:

- Product improvements that compound over time.
- Distribution, community trust, and user education.
- DeFi or crypto tooling with real operational usefulness.
- AI used inside a fast-moving team, not AI theater.

Project-shaping advice:

- If the project touches crypto, emphasize safety, transparency, and aligned incentives.
- If the project is not crypto, still show distribution mechanics and community trust.
- Include a "why users keep coming back" story.

### Ryan Kim

Links:

- X: https://x.com/0xryankim
- Hashed profile: https://www.hashed.com/team/ryan-sungho-kim/

Public signals:

- Luma lists him as Founding Partner at Hashed.
- Hashed profile says he focuses on Asian founders in Infrastructure, DeFi, Gaming, and Entertainment.
- Recent public X-derived reports discuss phishing, deepfake Zoom scams, wallet security, private keys, seed phrases, and the need for crypto UX that hides security complexity from mass users.
- A public podcast page frames him as having deep context on the Korean and Asian Web3 ecosystem.

Likely interests:

- Web3 infrastructure with credible security thinking.
- Founder-market fit in Asia.
- Consumer adoption that reduces complexity without hiding risk.
- Decentralization, self-custody, and operational security.

Project-shaping advice:

- If the idea involves crypto, address phishing, wallet safety, custody, and trust explicitly.
- Show how the project can cross from early adopters to mainstream users.
- Keep the founder/user narrative Asia-aware if relevant.

### Daniel Kang

Links:

- LinkedIn: https://www.linkedin.com/in/aer-dk/
- AER Labs: https://aerlabs.tech/

Public signals:

- Luma lists him as Co-Founder at AER Labs.
- Public LinkedIn snippets describe him as working on the full stack of LLM infrastructure and optimizing the entire model stack.
- Public AER Labs job posts describe a mission to democratize AI infrastructure through open-source inference optimization tools, with work spanning GPU kernels, routing systems, and high-leverage self-directed engineering.

Likely interests:

- AI infrastructure, inference, routing, and performance.
- Open-source systems that make frontier AI more accessible.
- Engineers who can work from low-level constraints to high-level product.
- Demonstrations with measurable technical improvements.

Project-shaping advice:

- If doing agent infrastructure, include metrics: speed, cost, reliability, eval pass rate, or autonomy duration.
- Show the architecture diagram and bottleneck.
- Prefer a working system with one real optimization over broad claims.

### Yash Lunagaria

Links:

- LinkedIn: https://www.linkedin.com/in/yashlunagaria
- X: https://x.com/yash_luna
- Azure author page: https://azure.microsoft.com/en-us/blog/author/yash-lunagaria/

Public signals:

- Luma lists him as Network School, ex Apple and Microsoft.
- Public X mirrors show recent posts about Network School, Solana Network School Outpost, internet communities becoming physical communities, and opportunity being globally distributed.
- Azure author page shows product work around managed, scalable SFTP support for Azure Blob Storage and unified data-lake workflows.

Likely interests:

- Startup societies, network states, and builder communities.
- Crypto ecosystems that bring online communities into physical coordination.
- Infrastructure products that make old workflows simpler and more scalable.
- Practical product thinking from big-tech infrastructure to frontier communities.

Project-shaping advice:

- Explain the community or coordination layer of the idea.
- If the product supports builders, show how it creates more opportunity for distributed teams.
- Keep the infra story simple: what painful workflow becomes one-click or autonomous?

## Combined Judge Lens For Idea Generation

When making product and implementation decisions on 17 May 2026, score each idea against these questions:

1. Impact: Who urgently needs this, and what changes for them during the 17 May 2026 demo?
2. Technical execution: Can the agent build a credible working version during the loop?
3. Originality: Is this more than a generic wrapper?
4. Demo quality: Can it be shown clearly in under three minutes?
5. Harness quality: Does the repo demonstrate spec writing, delegation, skills, and verification?
6. Infrastructure depth: Is there a real system, metric, or optimization underneath?
7. Community/distribution: Why would builders, users, or a network adopt it?
8. Trust and safety: What can go wrong, and how does the product reduce risk?

## Recommended Idea Bias

Given this judge mix, favor ideas that combine:

- AI agent workflow or harness engineering.
- Clear spec/eval/ticket infrastructure.
- A concrete builder, startup, crypto, or community use case.
- Measurable verification.
- A demo that shows the agent doing meaningful work autonomously.

Avoid:

- Generic chatbots.
- Vague productivity apps without a strong workflow.
- Crypto ideas that ignore security, trust, or user education.
- Agent demos with no visible spec, evaluator, or recovery behavior.

## Sources Consulted

- Luma event page: https://luma.com/4hx7p0vs
- Yeachan Heo LinkedIn post: https://kr.linkedin.com/posts/yeachan-heo-225b02219_oh-my-codex-your-codex-is-not-alone-activity-7428720515219050497-Y4_l
- Daeyeol Shim LinkedIn profile/activity: https://kr.linkedin.com/in/shimdx
- Jaewon Lee LinkedIn profile/search snippets: https://kr.linkedin.com/in/jaewonlee728/ko
- Brian Chau Network School profile: https://ns.com/brian
- Brian Chau LinkedIn profile/search snippets: https://www.linkedin.com/in/imaxblue
- Soju X mirror: https://w.twstalker.com/0xSoju
- Soju public crypto coverage: https://meme-insider.com/en/article/soju-lessons-jupiter-lfg-rethinking-airdrops-meteora-met/
- Ryan Kim Hashed profile: https://www.hashed.com/team/ryan-sungho-kim/
- Ryan Kim podcast page: https://pods.media/overnight-success/navigating-the-korean-web3-market-with-ryan-kim-hashed
- Ryan Kim public X-derived crypto security reports: https://blockchain.news/flashnews/crypto-security-alert-phishing-risks-in-calendar-invites-highlighted-by-ryan-kim-s-experience
- Daniel Kang LinkedIn profile/search snippets: https://sg.linkedin.com/in/aer-dk
- AER Labs public job post/search snippets: https://sg.linkedin.com/jobs/view/ultrathink-researcher-at-aer-labs-4365953336
- Yash Lunagaria X mirror: https://w.twstalker.com/yash_luna
- Yash Lunagaria Azure author page: https://azure.microsoft.com/en-us/blog/author/yash-lunagaria/
