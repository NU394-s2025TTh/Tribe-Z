Many teams in the first project talked about wanting to adhere to more standards as part of putting together their project. This page is a few ideas.

## File Structure

First, in terms of project structure, a common method is to separate by structure functionally; in this case "containers" (i.e., React components that contain other components) go in a containers folder. Components that are used by multiple containers go in a components folder. Hooks go in a hooks folder, handlers go in a handlers folder. A flat structure with a component per file could be used; or alternatively components can be placed in subfolders (a visual example is provided in canvas)

The benefit of folders, especially if locally scoped CSS in JavaScript is used, the styling can be placed in the folder; as can separate files that might have the definition of the properties. The disadvantage is the hierarchy gets deeper; also if the "index" convention is used, it is easy to get confused between the index files.

An alternative structure (one I prefer but there is no right answer here, it's like "tabs vs. spaces") is the folder structure mirrors major parts of the app. For example, assume a project has a frame with a toolbar containing menu items, and then a main area that contains various charts. There might also be forms that are used to control those charts:

```
|--appframe
   |--toolbar.tsx
   |--menuitem.tsx
   |--homescreen.tsx
|--dashboard
   |--chart.tsx
   |--controlform.tsx
   |--dashboardframe.tsx
```

It's also possible to have a mix, perhaps some common UI components in a "widgets" folder, and then subfolders for major focus areas of the application.

## Naming

It has been said there are only two problems in computer science, cache invalidation and naming things. This provides some ideas with the latter. As discussed, I think the first help is to use a spell checker. I personally use the extension [Code Spell Checker from state street](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker). The template and setup instructions for the first project included this. The nx workspace also includes prettier.

Then it also makes sense to have some conventions. Here are some thoughts I have searching around on the web a bit, and dialoging with various AI bots:

1. **Component Names**: Use PascalCase for React components. This helps React distinguish between components and HTML elements[^1].
2. **File Names**:
   - For non-component files, camelCase or kebab-case is common.
   - For component files, stick with PascalCase to match the component names[^2].
3. **Folders**: Keep main directories lowercase to differentiate them from components[^1].
4. **CSS Modules**: If you’re using CSS modules, use camelCase for class names to maintain consistency with JavaScript naming conventions[^1].
5. **TypeScript Types and Interfaces**: Prefix interfaces with an I, like IProps or IState, to distinguish them from classes and other types[^3]. Though there are a lot of people who disagree with using the "I".
6. **Event Handlers**: Start the names with handle, such as handleClick or handleInputChange.
7. **State Variables**: Use descriptive names that reflect their purpose, like isLoading or userList.
8. **Props**: Be descriptive and clear. For example, instead of data, use userData or profileData.
9. **Hooks**: For custom hooks, use the use prefix, like useAuth or useFormInput.

Remember, these are guidelines. More important than any guideline is that your team agrees on these conventions and applies them consistently throughout the project.

[^1]: [Is there an official style guide or naming convention for React-based projects?](https://stackoverflow.com/questions/55221433/is-there-an-official-style-guide-or-naming-convention-for-react-based-projects)
[^2]: [React Naming Conventions](https://www.upbeatcode.com/react/react-naming-conventions/)
[^3]: [Naming convention for TypeScript Types and Interfaces](https://typescript-eslint.io/rules/naming-convention/)
