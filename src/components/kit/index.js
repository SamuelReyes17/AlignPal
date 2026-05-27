/**
 * Kit barrel — minimal dark kit (Variant B).
 *
 * Import like:
 *   import { GradientCard, ListCard, ListRow, Button } from '../components/kit';
 *
 * These components are isolated from existing src/components/* on purpose.
 * Existing screens keep using the legacy GradientCard/CircularProgress/BarChart;
 * new minimal-dark screens use these.
 */
export { default as GradientCard }     from './GradientCard';
export { default as CircularProgress } from './CircularProgress';
export { default as BarChart }         from './BarChart';
export { default as StatTile }         from './StatTile';
export { ListCard, ListRow }           from './ListRow';
export { default as Button }           from './Button';
export { default as SegmentedToggle }  from './SegmentedToggle';
export { default as Chip }             from './Chip';
