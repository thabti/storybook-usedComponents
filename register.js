import React from 'react';
import addons from '@storybook/addons';
import generateComponentModel from './parse';
const componentModel = generateComponentModel();
class UsedComponents extends React.Component {
    constructor(...args) {
        super(...args);
        this.state = { components: [] };
        this.setComponents = this.setComponents.bind(this);
    }

    setComponents(components) {
        this.setState({ components });
    }

    componentDidMount() {
        const { api } = this.props;

        this.stopListeningOnStory = api.onStory((kind, story) => this.setComponents([]));

        this.stopListeningOnStory = api.onStory((kind, story) => {
            const currentComponent = kind.replace(/([A-Z]).+\s/g, '');
            const usedComponents = componentModel.find(item => item.file.includes(currentComponent));

            if (usedComponents && usedComponents.components) {
                this.setComponents(usedComponents.components);
            }
        });
    }

    render() {
        return (
            <div style={styles.usedComponents}>
                <p style={styles.description}>Components used:</p>
                <ul style={styles.usedComponents}>
                    {this.renderUsedComponents()}
                    <style
                        dangerouslySetInnerHTML={{
                            __html: `.components-used-item:hover { cursor: pointer; opacity: .7;}`,
                        }}
                    />
                </ul>
            </div>
        );
    }

    renderUsedComponents() {
        const { components } = this.state;

        const handleClick = item => {
            this.props.api.selectStory(`${this.capitalizeFirstLetter(item.type)} | ${item.component}`);
        };

        if (components.length < 1) {
            return (
                <li className="components-used-item" style={styles.usedComponents_li}>
                    No Other Component(s) Used
                </li>
            );
        }

        return components.map((item, key) => {
            return (
                <li
                    className="components-used-item"
                    key={key}
                    onClick={() => handleClick(item)}
                    style={{ ...styles.usedComponents_li, ...styles[item.type] }}
                >
                    <strong>{this.capitalizeFirstLetter(item.type)}</strong> - {item.component}
                </li>
            );
        });
    }

    capitalizeFirstLetter(string) {
        if (string) return string.charAt(0).toUpperCase() + string.slice(1);
        return '';
    }

    componentWillUnmount() {
        if (this.stopListeningOnStory) {
            this.stopListeningOnStory();
        }

        this.unmounted = true;
    }
}

const gradient = color => `linear-gradient(45deg, ${color} 25%, #fff 80%, #fff 47%, #fff 100%`;

const styles = {
    usedComponents: {
        fontFamily: '"San Francisco", BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
        listStyle: 'none',
        width: '80%',
        marginTop: 20
    },
    usedComponents_li: {
        padding: '10px',
        borderRadius: '4px',
        marginTop: '10px',
    },

    description: {
        margin: '0 2.2rem'
    },

    atoms: {
        background: gradient('#2EA39D'),
    },

    molecules: {
        background: gradient('#8290a1'),
    },

    organisms: {
        borderColor: '#d3317b',
        background: gradient('#d3317b'),
    }
};

addons.register('@wr/usedComponents', api => {
    addons.addPanel('@wr/usedComponents/panel', {
        title: 'Component(s)',
        render: () => <UsedComponents channel={addons.getChannel()} api={api} />,
    });
});
