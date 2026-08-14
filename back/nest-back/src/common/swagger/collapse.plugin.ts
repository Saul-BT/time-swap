export const CollapsePlugin = {
    wrapComponents: {
        // Adding buttons to the operations container
        operations: (Original: any, system: any) => (props: any) => {
            // Buttons
            const collapseAllButton = system.React.createElement(
                'button',
                {
                    className: 'btn',
                    style: {
                        marginRight: '10px',
                        marginBottom: '10px',
                    },
                    onClick: () => {
                        // Find all expanded operation buttons and click them
                        const expandedButtons = document.querySelectorAll(
                            'button.expand-operation[aria-expanded="true"]',
                        );
                        expandedButtons.forEach((button) => {
                            (button as HTMLButtonElement).click();
                        });
                    },
                },
                'Collapse All',
            );

            const expandAllButton = system.React.createElement(
                'button',
                {
                    className: 'btn',
                    style: {
                        marginRight: '10px',
                        marginBottom: '10px',
                    },
                    onClick: () => {
                        // Find all collapsed operation buttons and click them
                        const collapsedButtons = document.querySelectorAll(
                            'button.expand-operation[aria-expanded="false"]',
                        );
                        collapsedButtons.forEach((button) => {
                            (button as HTMLButtonElement).click();
                        });
                    },
                },
                'Expand All',
            );

            // Div pfor the buttons
            const buttonContainer = system.React.createElement(
                'div',
                {
                    style: {
                        display: 'flex',
                        justifyContent: 'flex-end',
                        marginBottom: '1em',
                        padding: '10px',
                    },
                },
                [collapseAllButton, expandAllButton],
            );

            // Put button container before the original content
            return system.React.createElement('div', null, [
                buttonContainer,
                system.React.createElement(Original, props),
            ]);
        },
    },
};
