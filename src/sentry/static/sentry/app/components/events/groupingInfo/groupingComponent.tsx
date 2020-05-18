import React from 'react';
import isObject from 'lodash/isObject';
import styled from '@emotion/styled';

import space from 'app/styles/space';
import {EventGroupComponent} from 'app/types';

import {shouldInlineComponentValue} from './utils';

type Props = {
  component: EventGroupComponent;
  showNonContributing: boolean;
};

const GroupingComponent = ({component, showNonContributing}: Props) => {
  const shouldInlineValue = shouldInlineComponentValue(component);

  const children = (component.values as EventGroupComponent[]).map((value, idx) => {
    let rv;
    if (isObject(value)) {
      // no point rendering such nodes at all, we never show them
      if (!value.contributes && !value.hint && value.values.length === 0) {
        return null;
      }
      // non contributing values are otherwise optional
      if (!showNonContributing && !value.contributes) {
        return null;
      }
      rv = (
        <GroupingComponent component={value} showNonContributing={showNonContributing} />
      );
    } else {
      rv = (
        <GroupingValue valueType={component.name || component.id}>
          {typeof value === 'string' || typeof value === 'number'
            ? value
            : JSON.stringify(value, null, 2)}
        </GroupingValue>
      );
    }

    return <GroupingComponentListItem key={idx}>{rv}</GroupingComponentListItem>;
  });

  return (
    <GroupingComponentWrapper isContributing={component.contributes}>
      <span>
        {component.name || component.id}
        {component.hint && <small>{` (${component.hint})`}</small>}
      </span>

      <GroupingComponentList isInline={shouldInlineValue}>
        {children}
      </GroupingComponentList>
    </GroupingComponentWrapper>
  );
};

const GroupingComponentList = styled('ul')<{isInline: boolean}>`
  padding: 0;
  margin: 0;
  list-style: none;
  &,
  & > li {
    display: ${p => (p.isInline ? 'inline' : 'block')};
  }
`;

const GroupingComponentListItem = styled('li')`
  padding: 0;
  margin: ${space(0.25)} 0 ${space(0.25)} ${space(1.5)};
`;

const GroupingValue = styled('code')<{valueType: string}>`
  display: inline-block;
  margin: ${space(0.25)} ${space(0.5)} ${space(0.25)} 0;
  font-size: ${p => p.theme.fontSizeSmall};
  padding: 0 ${space(0.25)};
  background: rgba(112, 163, 214, 0.1);
  color: #4e3fb4;

  ${({valueType}) =>
    (valueType === 'function' || valueType === 'symbol') &&
    `
    font-weight: bold;
    color: #2c58a8;
  `}
`;

const GroupingComponentWrapper = styled('div')<{isContributing: boolean}>`
  color: ${p => (p.isContributing ? null : p.theme.gray6)};

  ${GroupingValue} {
    opacity: ${p => (p.isContributing ? 1 : 0.6)};
  }
`;

export default GroupingComponent;
