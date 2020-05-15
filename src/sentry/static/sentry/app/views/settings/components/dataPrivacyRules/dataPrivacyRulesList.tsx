import React from 'react';
import styled from '@emotion/styled';

import {t} from 'app/locale';
import space from 'app/styles/space';
import TextOverflow from 'app/components/textOverflow';
import {IconDelete, IconEdit} from 'app/icons';
import Button from 'app/components/button';

import DataPrivacyRulesForm from './dataPrivacyRulesForm/dataPrivacyRulesForm';
import {getRuleTypeLabel, getMethodTypeLabel} from './dataPrivacyRulesForm/utils';

type Rule = React.ComponentProps<typeof DataPrivacyRulesForm>['rule'];
type Props = {
  rules: Array<Rule>;
  onShowEditRuleModal?: (id: Rule['id']) => () => void;
  onDeleteRule?: (id: Rule['id']) => () => void;
};

const DataPrivacyRulesList = ({rules, onShowEditRuleModal, onDeleteRule}: Props) => (
  <List>
    {rules.map(({id, method, type, source}) => {
      const methodLabel = getMethodTypeLabel(method);
      const typelabel = getRuleTypeLabel(type);
      return (
        <ListItem key={id}>
          <TextOverflow>
            {`[${methodLabel}] [${typelabel}] ${t('from')} [${source}]`}
          </TextOverflow>
          {onShowEditRuleModal && (
            <Button size="small" onClick={onShowEditRuleModal(id)} icon={<IconEdit />} />
          )}
          {onDeleteRule && (
            <Button size="small" onClick={onDeleteRule(id)} icon={<IconDelete />} />
          )}
        </ListItem>
      );
    })}
  </List>
);

export default DataPrivacyRulesList;

const List = styled('ul')`
  list-style: none;
  margin: 0;
  padding: 0;
  margin-bottom: 0 !important;
`;

const ListItem = styled('li')`
  display: grid;
  grid-template-columns: auto max-content max-content;
  grid-column-gap: ${space(1)};
  align-items: center;
  padding: ${space(1)} ${space(2)};
  border-bottom: 1px solid ${p => p.theme.borderDark};
  &:hover {
    background-color: ${p => p.theme.offWhite};
  }
  &:last-child {
    border-bottom: 0;
  }
`;
