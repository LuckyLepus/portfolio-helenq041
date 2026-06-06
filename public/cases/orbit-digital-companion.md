# Case Study: Orbit Digital Companion

> **An AI-powered podcast editorial and knowledge management system**

---

## Summary

**EN:** Orbit is an AI-augmented editorial system designed for podcast production workflows. It addresses the challenge of transforming raw audio conversations into structured, distributable content across multiple channels — while preserving the editorial voice and reducing the human time required for each episode's post-production. The system integrates LLMs for transcription refinement, content atomization, and multi-format distribution drafting.

**ZH 摘要：** Orbit 是一个为播客生产工作流设计的 AI 辅助编辑系统。它解决了将原始音频对话转化为结构化、可跨多渠道分发内容的挑战——同时保留编辑声音并减少每集后期制作所需的人工时间。该系统集成 LLM 用于转录优化、内容原子化和多格式分发草稿生成。

---

## Project Metadata

| Field | Detail |
|---|---|
| **Project Type** | AI workflow system design / Editorial infrastructure |
| **Time** | 2025 – 2026 (ongoing iteration) |
| **My Role** | System Designer · Workflow Architect · Prompt Engineer |
| **Status** | Internal use / Proof of concept stage |
| **Primary AI Tools** | Claude (for editorial tasks), Gemini (for structure), Whisper-based transcription |

---

## Problem

Podcast production involves substantial post-production editorial work that is largely manual:
- Transcription review and cleanup
- Show notes writing
- Social media copy for each platform (WeChat, Xiaohongshu, Weibo, etc.)
- Highlight clip identification
- Knowledge archiving for future reference

Each episode can require 4–8 hours of human editorial time. For independent creators or small teams, this is the primary bottleneck that limits publishing frequency and content quality.

Additionally, podcast content represents significant intellectual capital — expert conversations, curated research, unique perspectives — that typically "disappears" after the episode release with no systematic capture for future retrieval.

---

## Solution

A multi-stage AI editorial pipeline:

**Stage 1 — Transcription & Cleanup**
- Whisper (or equivalent) generates raw transcript
- LLM refinement pass: remove filler words, fix proper nouns, improve readability
- Speaker attribution and segmentation

**Stage 2 — Content Atomization**
- LLM extracts: key quotes, core arguments, segment summaries, timestamp markers
- Creates structured content object (JSON-like schema) per episode

**Stage 3 — Multi-Format Drafting**
- Show notes (long-form, SEO-optimized)
- Platform-specific social copy (WeChat article intro, Xiaohongshu carousel script, Weibo thread)
- Episode chapter breakdown
- Guest bio context integration

**Stage 4 — Knowledge Archiving**
- Episode knowledge objects stored in structured Obsidian vault
- Tagged and linked for future retrieval
- Enables: "find everything we've discussed about X topic across all episodes"

---

## Tools

- **Transcription:** Whisper (OpenAI), local deployment
- **Editorial LLM:** Claude 3.5/4 (superior for editorial voice preservation)
- **Structure LLM:** Gemini (for document/schema generation)
- **Knowledge base:** Obsidian with Dataview plugin
- **Workflow orchestration:** n8n (for API connections between steps)
- **Prompt design:** Custom system prompts tuned to the specific show's voice and editorial standards

---

## Deliverables

1. **System architecture document** — full pipeline diagram and stage-by-stage specification
2. **Prompt library** — system prompts for each editorial stage
3. **Obsidian vault template** — pre-structured knowledge base for podcast content
4. **n8n workflow export** — reusable automation template
5. **Editorial quality framework** — how to evaluate LLM output at each stage

---

## Result

- Estimated reduction in per-episode editorial time: from 4–8 hours to approximately 1–2 hours (human review and refinement of AI drafts)
- Consistent content structure across episodes enables better audience navigation
- Knowledge base enables topic research across episode archive
- System is transferable to other podcast productions with similar editorial needs

*Note: Time estimates are based on internal testing. Results may vary based on episode length, content complexity, and editorial quality standards.*

---

## Reusable Value

The Orbit system architecture represents a transferable pattern for **any content production workflow** that involves:
- Repeated content types (consistent structure per episode/piece)
- Multi-channel distribution requirements
- Knowledge capital that should be captured, not lost
- Small teams or independent creators who cannot afford full-time editorial staff

The core insight: **AI excels at content transformation and reformatting; humans excel at voice, judgment, and quality gates.** Orbit is designed around this division.

---

## Keywords

podcast production, AI editorial workflow, content atomization, multi-format distribution, knowledge management, Whisper transcription, Claude, n8n, Obsidian, independent media, workflow automation, content pipeline

---

*HelenQ Case Study | June 2026*
