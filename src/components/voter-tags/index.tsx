import { FunctionComponent } from 'react';
import { TagInputsProps } from './types';
import VoterTags from './canvassing-tags';

export type Props = {
  tags: TagInputsProps[];
};

const Tags: FunctionComponent<Props> = ({ tags }) => {
  return <VoterTags items={tags} />;
};

export default Tags;
