import * as React from 'react';
import { Box, BoxProps } from '@material-ui/core';
import { Property } from 'csstype';

import { styles } from 'vs/nex/ui/layouts/Stack.styles';
import { commonStyles } from 'vs/nex/ui/Common.styles';

type StackProps = {
	direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
	justifyContent?: Property.JustifyContent;
	alignItems?: Property.AlignItems;
	wrap?: true | 'nowrap' | 'wrap-reverse';
	growItems?: boolean;
	shrinkItems?: boolean;
	itemsBasis?: Property.FlexBasis<string | 0>;
	spacing?: number;
	stretchContainer?: boolean;
	children: React.ReactNode;
	className?: string;
	boxProps?: BoxProps;
};

export const Stack = React.forwardRef<HTMLElement, StackProps>(
	(
		{
			direction = 'row',
			justifyContent,
			alignItems,
			wrap,
			growItems,
			shrinkItems,
			itemsBasis,
			spacing,
			stretchContainer = false,
			children,
			boxProps,
			...rest
		},
		ref,
	) => {
		const stackStyle = styles.stack({
			direction,
			justifyContent,
			alignItems: alignItems ?? 'center',
			wrap,
			growItems,
			shrinkItems,
			itemsBasis,
			spacing: spacing ?? 1,
		});

		return (
			<Box
				css={(theme) => [
					stackStyle(theme),
					stretchContainer &&
						(direction === 'column' ? commonStyles.fullWidth : commonStyles.fullHeight),
				]}
				ref={ref}
				{...boxProps}
				/* we spread any additional props onto the box to support the Tooltip component
				 * see https://material-ui.com/components/tooltips/#custom-child-element
				 */
				{...rest}
			>
				{children}
			</Box>
		);
	},
);
