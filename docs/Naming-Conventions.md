# File Structure

Separate folders by structure functionality. For example, "containers" (i.e., React components that contain other components) go in a "containers" folder. Components that are used by multiple containers go in a "components" folder. Hooks go in a "hooks" folder, handlers go in a "handlers" folder. 
Put css styling files with Typescript files in their corresponding folders.


# Naming Conventions

1. Component Names: Use PascalCase for React components. This helps React distinguish between components and HTML elements
2. File Names: For non-component files, camelCase is common. For component files, stick with PascalCase to match the component names
3. Folders: Keep main directories lowercase to differentiate them from components
4. CSS Modules: If you’re using CSS modules, use camelCase for class names to maintain consistency with JavaScript naming conventions
5. TypeScript Types and Interfaces: PascalCase for naming and then add "Prop" at the end. For example, "ClassProps" would be a valid interface or type name.
6. Event Handlers: Start the names with handle, such as handleClick or handleInputChange.
7. State Variables: Use descriptive names that reflect their purpose, like isLoading or userList.
8. Props: Be descriptive and clear. For example, instead of data, use userData or profileData.
9. Hooks: For custom hooks, use the use prefix, like useAuth or useFormInput.
