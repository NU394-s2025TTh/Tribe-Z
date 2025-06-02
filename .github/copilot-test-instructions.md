Always use vitest and never jest.
Mock sub components using `vi.mock` and not `jest.mock`.
create mock sub components rather than using the real ones unless specified otherwise.
Place all tests in a describe block. Create sub describe blocks for specific methods or functionality within the component.
Indicate you are using these copilot test instructions in the first line of your test file.
