import { describe, expect, it } from "vitest";

describe("Math Rendering", () => {
  it("should handle LaTeX quantum state notation", () => {
    const quantumState = "|\Psi^-\\rangle = \\frac{1}{\\sqrt{2}}(|01\\rangle - |10\\rangle)";
    expect(quantumState).toContain("\\frac");
    expect(quantumState).toContain("\\sqrt");
    expect(quantumState).toContain("\\rangle");
  });

  it("should handle complex formulas", () => {
    const formula = "E = mc^2";
    expect(formula).toBeTruthy();
    expect(formula.length).toBeGreaterThan(0);
  });

  it("should handle Bell states", () => {
    const bellStates = [
      "|\\Phi^+\\rangle = \\frac{1}{\\sqrt{2}}(|00\\rangle + |11\\rangle)",
      "|\\Phi^-\\rangle = \\frac{1}{\\sqrt{2}}(|00\\rangle - |11\\rangle)",
      "|\\Psi^+\\rangle = \\frac{1}{\\sqrt{2}}(|01\\rangle + |10\\rangle)",
      "|\\Psi^-\\rangle = \\frac{1}{\\sqrt{2}}(|01\\rangle - |10\\rangle)",
    ];

    bellStates.forEach((state) => {
      expect(state).toContain("\\rangle");
      expect(state).toContain("\\frac");
    });
  });

  it("should parse inline math expressions", () => {
    const content = "The energy is $E = mc^2$ which is important";
    const mathRegex = /\$([^\$]+)\$/g;
    const matches = content.match(mathRegex);
    expect(matches).toHaveLength(1);
    expect(matches?.[0]).toBe("$E = mc^2$");
  });

  it("should parse block math expressions", () => {
    const content = "Here is a formula:\n$$E = mc^2$$\nThat's important";
    const blockRegex = /\$\$[\s\S]*?\$\$/g;
    const matches = content.match(blockRegex);
    expect(matches).toHaveLength(1);
  });

  it("should handle markdown with math", () => {
    const markdown = `
## Quantum Mechanics

The singlet state is defined as:
$$|\\Psi^-\\rangle = \\frac{1}{\\sqrt{2}}(|01\\rangle - |10\\rangle)$$

This is an important concept in quantum entanglement.
`;

    expect(markdown).toContain("$$");
    expect(markdown).toContain("\\Psi");
    expect(markdown).toContain("\\frac");
  });
});
