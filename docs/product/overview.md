# Product Overview

## Goal

Twitch Chat Guard is a Chromium extension that inspects the message a user is composing in Twitch chat before it is sent. If the message appears risky, the extension warns the user and temporarily blocks sending unless the user deliberately holds Enter long enough to override the lock.

## Product Objectives

- reduce accidental rule-breaking chat messages,
- provide immediate feedback while the user is still typing,
- make higher-risk messages require stronger user intent,
- keep the moderation decision understandable by naming the triggered rule.

## Core Concept

Each draft message is classified as:

- `Safe`
- `Warning`
- `Violation`

Severity is ordered:

- `Violation` > `Warning` > `Safe`

Evaluation must stop at the first matching `Violation`. Only when no `Violation` matches may `Warning` rules be evaluated.
