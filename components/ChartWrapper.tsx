
import React, { ReactNode } from 'react';
import { useTheme } from '../lib/theme';

interface ChartWrapperProps {
  children: ReactNode;
}

const ChartWrapper: React.FC<ChartWrapperProps> = ({ children }) => {
  const { theme } = useTheme();
  
  const colors = {
    light: {
      text: '#0F172A',
      stroke: '#E5E7EB',
      primary: '#2563EB',
      secondary: '#4ADE80'
    },
    dark: {
      text: '#E5EAF2',
      stroke: '#1F2937',
      primary: '#2563EB',
      secondary: '#4ADE80'
    }
  };

  const currentColors = theme === 'dark' ? colors.dark : colors.light;

  const childWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
        // This is a simplified way to pass props. A real implementation
        // might need to recursively traverse the children to apply props
        // to specific Recharts components like XAxis, YAxis, etc.
        // For now, we'll assume the chart components can consume these via context or direct props.
        // A more robust solution is to use React.Context to provide theme colors.
      // Fix: Use Object(child.props) to safely convert props to an object before spreading to avoid type errors.
      return React.cloneElement(child, {
        ...Object(child.props), 
        themeColors: currentColors 
      });
    }
    return child;
  });

  // A better approach would be to use a context provider here.
  // This is a placeholder to show the intent.
  // Recharts components themselves will need to be configured to use these colors.
  // For example, in the chart component: `<XAxis stroke={props.themeColors.text} />`
  // This component doesn't do much by itself without that connection.

  return <div className="w-full h-full">{children}</div>;
};

export default ChartWrapper;
