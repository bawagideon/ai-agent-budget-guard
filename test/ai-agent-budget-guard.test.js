const test = require('node:test');
const assert = require('node:assert');
const { AIAgentBudgetGuard } = require('../src/index.js');

test('AIAgentBudgetGuard: stops agent when budget cap is met', () => {
  const guard = new AIAgentBudgetGuard({ maxBudgetUSD: 5.0 });
  const res = guard.evaluateExecution({ currentCostUSD: 5.05, toolCallHistory: ['search'] });
  assert.strictEqual(res.halt, true);
  assert.strictEqual(res.reason, 'BUDGET_EXHAUSTED');
});

test('AIAgentBudgetGuard: catches cyclic repetitive tool loops', () => {
  const guard = new AIAgentBudgetGuard();
  const res = guard.evaluateExecution({
    currentCostUSD: 1.2,
    toolCallHistory: ['search', 'search', 'search']
  });
  assert.strictEqual(res.halt, true);
  assert.strictEqual(res.reason, 'INFINITE_RECURSIVE_LOOP_DETECTED');
});
