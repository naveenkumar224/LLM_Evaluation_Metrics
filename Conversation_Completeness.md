# Conversation Completeness Metric Implementation Guide

## Overview

This document describes how to implement a new DeepEval metric named **Conversation Completeness** using the same architecture, UI workflow, and evaluation pattern already used by existing metrics.

Source Requirement Reference:
Implement Conversation Completeness Metric document.

---

# Objective

Add a new Multi-Turn Evaluation Metric:

Metric Name:

Conversation Completeness

Purpose:

Evaluate whether an LLM chatbot is able to complete an end-to-end conversation by:

- satisfying all user intentions raised throughout a conversation
- addressing secondary requests in addition to the primary task
- meeting user needs holistically, not just partially
- serving as a proxy for overall user satisfaction
- detecting gaps where user intentions were acknowledged but left unresolved

The implementation must reuse the existing architecture.

Do not redesign UI components.

---

# Architecture Integration

Reuse Existing Flow

```text
User Input (Multi-Turn Conversation)
    ↓
LLM Response (Multiple Assistant Turns)
    ↓
Metric Selection
    ↓
Conversation Completeness Evaluation
    ↓
Score
    ↓
Reason
    ↓
Result Card
```

---

# Backend Changes

## Add Metric Type

Add:

Conversation Completeness

to the existing metric registry.

---

## Metric Configuration

Display Name:

Conversation Completeness

Description:

Measures whether the chatbot satisfies all user intentions throughout an end-to-end conversation.

---

# Teaching Mode Content

## What is Conversation Completeness?

Conversation Completeness evaluates whether an LLM chatbot addresses every intention expressed by the user across all turns of a conversation, not just the primary task.

---

## Why Conversation Completeness is Important

- unresolved user intentions lead to poor experiences
- partial responses reduce trust in AI assistants
- secondary requests are often ignored, frustrating users
- incomplete conversations fail enterprise-grade chatbot standards

---

## Why Enterprises Evaluate Conversation Completeness

- Chatbot Quality Assurance
- User Satisfaction Measurement
- Multi-Turn Conversation Testing
- Customer Experience Governance

---

# Advantages

- Detects unaddressed user intentions
- Measures breadth of chatbot response coverage
- Serves as a proxy for overall user satisfaction
- Supports multi-turn conversational evaluation

---

# Limitations

- Requires well-structured multi-turn conversations
- LLM-dependent extraction of user intentions may vary
- Context-dependent: what counts as "satisfied" can be subjective
- Does not evaluate depth or accuracy of each response — only whether each intention was addressed

---

# Industry Usage

- Customer Support Chatbots
- Banking Virtual Assistants
- Healthcare Appointment Assistants
- HR Copilots
- E-commerce Help Desks

---

# Real World Applications

- Banking Customer Service Bots
- IT Helpdesk Assistants
- Insurance Claim Chatbots
- Retail Order Management Chatbots
- HR Onboarding Assistants

---

# Best Practices

- Provide full multi-turn conversation history for evaluation
- Ensure user turns clearly express distinct intentions
- Use threshold of 0.5 as a minimum baseline and increase for critical use cases
- Monitor conversations where score drops below 0.75 regularly
- Establish governance reviews for chatbots handling high-stakes interactions

---

# Common Mistakes

- Evaluating only the final assistant turn instead of the full conversation
- Assuming goal completion means all user intentions were satisfied
- Using single-turn test cases for what is a multi-turn metric
- Conflating Conversation Completeness with Goal Accuracy

---

# How Is It Calculated

## Formula

```
Conversation Completeness = Number of Satisfied User Intentions
                            ─────────────────────────────────────
                            Total Number of User Intentions
```

## Calculation Steps

Step 1:
An LLM extracts all high-level user intentions from the "user" turns in the conversation.

Step 2:
The same LLM checks each extracted intention against the "assistant" turns to determine whether it was satisfied.

Step 3:
The ratio of satisfied intentions to total intentions produces the final score.

---

# Sample Library

## Good Example

Conversation:

User: I need to reset my password and also update my billing address.
Assistant: I have reset your password. A confirmation email has been sent. I have also updated your billing address to the one you provided.

Result:

High Completeness (Score: 1.00 — both intentions satisfied)

---

## Bad Example

Conversation:

User: I need to reset my password and also update my billing address.
Assistant: I have reset your password. A confirmation email has been sent.

Result:

Low Completeness (Score: 0.50 — billing address intention not satisfied)

---

# Additional Sample Library

## Customer Support

Good:
Bot addressed both the refund request and the replacement shipment inquiry raised by the user.

Bad:
Bot processed the refund but did not respond to the user's question about the replacement timeline.

---

## Banking

Good:
Bot answered the account balance query and also provided the recent transaction history the user requested.

Bad:
Bot only provided the account balance and ignored the request for recent transactions.

---

## Healthcare

Good:
Bot confirmed the appointment booking and also sent the pre-appointment instructions as the user requested.

Bad:
Bot confirmed the appointment but did not address the user's request for preparation instructions.

---

## IT Helpdesk

Good:
Bot resolved the VPN access issue and also guided the user on resetting their two-factor authentication.

Bad:
Bot fixed the VPN issue but did not address the two-factor authentication reset the user mentioned.

---

## HR Copilot

Good:
Bot explained the leave policy and also provided the steps to apply for leave that the user asked about.

Bad:
Bot explained the leave policy but did not address the user's follow-up question on the application process.

---

# Score Interpretation

| Score Range | Interpretation |
|------------|----------------|
| 0.90 - 1.00 | Highly Complete — All user intentions satisfied |
| 0.75 - 0.89 | Mostly Complete — Minor intentions missed |
| 0.50 - 0.74 | Partially Complete — Several intentions unaddressed |
| Below 0.50 | Incomplete — Significant user needs unmet |

---

# Q&A Preparation

Q1. What is Conversation Completeness?

Conversation Completeness measures whether an LLM chatbot satisfies all user intentions expressed throughout a multi-turn conversation.

---

Q2. How is Conversation Completeness different from Goal Accuracy?

Goal Accuracy measures whether one primary overarching goal was achieved. Conversation Completeness measures breadth — whether every intention raised by the user, including secondary ones, was addressed.

---

Q3. What does an incomplete conversation look like?

A user asks to reset a password and update billing details, but the bot only resets the password. The billing update intention is unsatisfied, reducing the score.

---

Q4. Can a bot be accurate but still score low on Conversation Completeness?

Yes. A bot can answer correctly for the intentions it addresses while still missing other user intentions entirely, resulting in a low completeness score.

---

Q5. How does the metric determine user intentions?

An LLM extracts high-level intentions from all "user" turns in the conversation, then evaluates each against the "assistant" turns to check if they were met.

---

Q6. Can Conversation Completeness serve as a user satisfaction proxy?

Yes. Since it reflects how many user needs were met end to end, the metric works well as a proxy for overall satisfaction in chatbot use cases.

---

# UI Requirements

Reuse Existing Components

- Metric Selector
- Teaching Mode
- Sample Library
- Evaluation Workflow
- Result Cards

No new UI redesign required.

---

# Test Case Setup

## Required Arguments

ConversationalTestCase requires:

- turns: A list of Turn objects with role ("user" or "assistant") and content fields.

## Optional Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| threshold | float | 0.5 | Minimum passing score |
| model | string or DeepEvalBaseLLM | gpt-5.4 | LLM used for evaluation |
| include_reason | boolean | True | Include reason in output |
| strict_mode | boolean | False | Binary score: 1 or 0 |
| async_mode | boolean | True | Enable concurrent execution |
| verbose_mode | boolean | False | Print intermediate steps |

## Code Reference

```python
from deepeval import evaluate
from deepeval.test_case import Turn, ConversationalTestCase
from deepeval.metrics import ConversationCompletenessMetric

convo_test_case = ConversationalTestCase(
    turns=[
        Turn(role="user", content="I need to reset my password and update my billing address."),
        Turn(role="assistant", content="I have reset your password and updated your billing address."),
    ]
)

metric = ConversationCompletenessMetric(threshold=0.5)
evaluate(test_cases=[convo_test_case], metrics=[metric])
```

---

# Validation Checklist

- Metric visible in selector
- Teaching mode displays correctly
- Sample library available
- Score generated
- Result card displayed
- Workflow matches existing metrics
- Multi-turn conversation test case accepted
- Standalone measure() execution supported

---

# Implementation Phases

Phase 1

- Add Conversation Completeness metric backend

Phase 2

- Add teaching content

Phase 3

- Add sample library

Phase 4

- Add score interpretation

Phase 5

- Integrate UI selector

Phase 6

- Testing and validation

---

# Final Expected Flow

```text
Select Conversation Completeness Metric
    ↓
Provide Multi-Turn Conversation Input
    ↓
LLM Extracts User Intentions from User Turns
    ↓
LLM Evaluates Each Intention Against Assistant Turns
    ↓
Score = Satisfied Intentions / Total Intentions
    ↓
Reason
    ↓
Result Card
```