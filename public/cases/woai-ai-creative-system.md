# Case Study: WOAI AI Creative System

> **AICC Creative Workflow SOP and Infrastructure — AI创意工作流SOP与基础设施**

---

## Summary

**EN:** WOAI (Work with AI) is HelenQ's systematized AI creative workflow framework for the event and integrated marketing industry. It translates ad-hoc AI tool usage into documented, repeatable, quality-controlled creative production pipelines — covering visual design, 3D rendering, pitch preparation, and LLM-assisted content creation. The system was designed to make AI adoption practical for creative teams, not just experimental.

**ZH 摘要：** WOAI（Work with AI）是 HelenQ 为活动与整合营销行业系统化的 AI 创意工作流框架。它将零散的 AI 工具使用转化为有文档记录、可复现、具有质量控制的创意生产流水线——涵盖视觉设计、3D 渲染、提案准备和 LLM 辅助内容创作。该系统旨在让创意团队的 AI 采用变得实用，而非仅仅是实验性的。

---

## Project Metadata

| Field | Detail |
|---|---|
| **Project Type** | Creative workflow system / SOP documentation |
| **Time** | 2023 – 2026 (iterative development) |
| **My Role** | Sole Architect · System Designer · Documentation Author |
| **Status** | Active / Continuously updated |
| **Target Users** | Creative directors, designers, strategists in event/marketing agencies |

---

## Problem

Creative teams in the event and PR industry face a specific challenge with AI adoption:

1. **Tool abundance without system:** Teams discover AI tools individually, but usage remains inconsistent and non-collaborative
2. **Quality unpredictability:** AI image output varies wildly without structured prompting and workflow discipline
3. **No institutional capture:** When practitioners develop AI skills, that knowledge doesn't transfer to the team
4. **Fear of "wrong" AI:** Creative directors and account teams are uncertain which AI tools are appropriate for which client/output type
5. **Speed pressure without quality framework:** Teams use AI fast but without knowing how to evaluate quality — leading to client-facing risk

The specific context: China's event/PR industry is highly competitive, pitch timelines are short (often 48–72 hours), and visual quality is a primary differentiator. AI tools could dramatically accelerate pitch production — but without a system, they introduce new quality risks.

---

## Solution

A five-module SOP framework (the "WOAI System"):

### Module 1 — AI-Driven Design Workflow (活动行业AI驱动设计工作流)
End-to-end pipeline for event visual design using AI. Covers:
- Brief → mood board → concept art → 3D rendering → final delivery
- Tool selection by stage (Midjourney vs. SD vs. Runway vs. manual)
- Quality gates at each transition point
- File naming and organization standards

### Module 2 — ComfyUI 3D Design Graph (ComfyUI工作流3D设计流程示意)
Node-based workflow for 3D-to-2D AI generation:
- Blender → ControlNet → Stable Diffusion pipeline
- Lighting, material, and perspective control via AI nodes
- Batch processing setup for multiple variations
- Version control for node graphs

### Module 3 — Prompt Engineering Manual (Prompt工程经验汇总手册)
Practitioner-level prompt engineering for commercial creative:
- System prompt templates by content type (concept art, product renders, event atmosphere)
- Negative prompt libraries for common quality issues
- Style consistency techniques (using reference images, LoRA models)
- Client-safe vs. experimental prompt strategies

### Module 4 — Intelligent Enterprise OS Framework (公司级智能操作系统底层框架)
Architecture for AI-augmented creative organizations:
- Agent role definitions for creative workflows
- Tool integration map (which AI tool connects to which stage)
- Human oversight checkpoints
- Knowledge base integration (institutional prompt and asset library)

### Module 5 — CODEX Methodology (CODEX个人经验谈)
Personal methodology documentation for AI-augmented creative practice:
- How to move from strategic brief to code-level execution
- Cross-discipline skill bridges (strategy → design → technical)
- Learning path for creative professionals entering AI space

---

## Tools

- **Visual AI:** Midjourney V6, Stable Diffusion (SDXL), ComfyUI, Runway Gen-2/3, Kling
- **LLMs:** GPT-4, Claude 3.5, Gemini 1.5 Pro
- **3D:** Blender (basic modeling for ControlNet reference), Spline
- **Documentation:** Notion (team-facing), Obsidian (personal knowledge base)
- **Workflow:** n8n (for automation connections), ComfyUI (for node-based image workflows)

---

## Deliverables

1. **5 SOP documents** (see Modules above) — all with annotated visual examples
2. **Prompt library** — categorized by creative domain and output type
3. **ComfyUI workflow exports** — importable node graphs for key visual production pipelines
4. **Training materials** — simplified versions for team onboarding
5. **Quality evaluation rubric** — how to assess AI output before client presentation

---

## Result

- Created a practical, team-transferable AI creative system where previously none existed
- Reduced concept art iteration time for event pitches (internal estimate: 2–3x faster with system vs. without)
- Enabled non-AI-specialist team members to produce AI-assisted visuals with consistent quality
- System has been applied to: event pitch visuals, brand activation concepts, social media creative, internal capability demonstrations

*Note: Results reflect internal use and practitioner estimates. External validation data not available.*

---

## Related: The $2M AI Knowledge Base Autopsy

As a counterpoint to WOAI's successes, HelenQ also documented a significant failure: a ~2M RMB AI knowledge base project that collapsed despite strong execution. The autopsy (viewable in Project 03 on the portfolio) examines:
- Why technically correct execution of a wrong strategy still fails
- Structural mismatches between AI knowledge systems and actual organizational needs
- How to identify "solving the wrong problem" before it's too late

This failure case is intentionally included alongside WOAI as an honest counterbalance.

---

## Reusable Value

WOAI's core contribution is a **template for AI workflow systemization** applicable beyond the event industry:

1. **Audit before standardizing:** Understand how AI is actually being used before designing the system
2. **SOP design is creative direction:** The best AI workflows have clear creative intent, not just technical steps
3. **Quality gates are non-negotiable:** Speed gains from AI must be matched with quality checkpoints, or the speed becomes a liability
4. **Knowledge capture is the long game:** The most valuable part of any AI workflow is the institutional knowledge it generates — which must be actively captured

---

## Keywords

AI creative workflow, AICC, SOP design, prompt engineering, Midjourney, Stable Diffusion, ComfyUI, event industry, brand events, creative production pipeline, AI tool adoption, knowledge management, creative director, Beijing, China

---

*HelenQ Case Study | June 2026*
