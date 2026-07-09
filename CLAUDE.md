# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A JavaScript practice project containing two independent modules: a user management system with role-based access control, and a calculator module.

## Commands

- 
pm test — Run all tests (Jest)
- 
pm test -- --testPathPattern="calculator" — Run only calculator tests
- 
pm test -- --testPathPattern="users" — Run only user module tests
- 
ode run-calculator.js <a> <op> <b> — Run calculator via CLI (e.g. 
ode run-calculator.js 10 add 5)

## Architecture

### users.js — User Management Module

- **Pattern:** Module-level encapsulated state with immutable updates. No classes.
- **Immutability:** Internal store array is sealed via Object.freeze() on every mutation. All public getters return shallow copies.
- **Validation:** All public API functions validate inputs at the boundary.
- **Role system:** Three roles (admin, editor, viewer) with a permission matrix.
- **Exports:** addUser, getUser, updateUser, deleteUser, changeRole, listUsers, listByRole, clearUsers, getUserCount, hasPermission, canDelete, canEdit, canView

### calculator.js — Arithmetic Module

- Pure functions with shared validateNumbers() helper. calculate() uses a lookup table instead of conditionals.
- **Exports:** add, subtract, multiply, divide, calculate

### Testing

Both modules use Jest (AAA pattern). Users test calls clearUsers() in beforeEach for isolation.

## Conventions

- 'use strict' at the top of every new file
- const only, never var
- No console.log in production code
- JSDoc on all exported functions
- Input validation at every module boundary
- Immutable data patterns: spread syntax or Object.freeze(), never mutate in place
