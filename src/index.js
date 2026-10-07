// AI Agent Budget Guard & Loop Breaker Engine
class AIAgentBudgetGuard {
  constructor(options = {}) {
    this.maxBudgetUSD = options.maxBudgetUSD || 10.0;
    this.maxToolCalls = options.maxToolCalls || 25;
  }

  evaluateExecution(session) {
    const { currentCostUSD, toolCallHistory } = session;

    if (currentCostUSD >= this.maxBudgetUSD) {
      return {
        halt: true,
        reason: 'BUDGET_EXHAUSTED',
        action: 'TERMINATE_EXECUTION'
      };
    }

    if (toolCallHistory && toolCallHistory.length >= this.maxToolCalls) {
      return {
        halt: true,
        reason: 'MAX_TOOL_CALL_DEPTH_REACHED',
        action: 'TERMINATE_EXECUTION'
      };
    }

    // Check for repetitive cyclic calls (e.g. 3 consecutive identical tools)
    if (toolCallHistory && toolCallHistory.length >= 3) {
      const last3 = toolCallHistory.slice(-3);
      if (last3[0] === last3[1] && last3[1] === last3[2]) {
        return {
          halt: true,
          reason: 'INFINITE_RECURSIVE_LOOP_DETECTED',
          action: 'TERMINATE_EXECUTION'
        };
      }
    }

    return { halt: false, status: 'PERMITTED_TO_CONTINUE' };
  }
}

module.exports = { AIAgentBudgetGuard };
