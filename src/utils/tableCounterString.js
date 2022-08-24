import { Box, SpaceBetween, Button } from '@amzn/awsui-components-react/polaris';

export const getFilterCounterText = count => `${count} ${count === 1 ? 'match' : 'matches'}`;

export const TableNoMatchState = props => (
    <Box margin={{ vertical: 'xs' }} textAlign="center" color="inherit">
      <SpaceBetween size="xxs">
        <div>
          <b>No matches</b>
          <Box variant="p" color="inherit">
            We can't find a match.
          </Box>
        </div>
        <Button onClick={props.onClearFilter}>Clear filter</Button>
      </SpaceBetween>
    </Box>
  );
  
export const TableEmptyState = ({ resourceName }) => (
<Box margin={{ vertical: 'xs' }} textAlign="center" color="inherit">
    <SpaceBetween size="xxs">
    <div>
        <b>No {resourceName.toLowerCase()}s</b>
        <Box variant="p" color="inherit">
        No {resourceName.toLowerCase()}s associated with this resource.
        </Box>
    </div>
    <Button>Create {resourceName.toLowerCase()}</Button>
    </SpaceBetween>
</Box>
);