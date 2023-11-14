import { v4 as uuid } from "uuid";
import { Wrapper, Current, Menu, MenuItem, HighlightMenuItem } from "./styled";

const Select = ({ candidates, current, onChange }) => {
  return (
    <Wrapper>
      <Current tabIndex={0}>{current}</Current>
      <Menu tabIndex={1}>
        {candidates.map((candidate) => {
          const Component =
            candidate === current ? HighlightMenuItem : MenuItem;
          return (
            <Component
              key={uuid()}
              onClick={() => {
                onChange(candidate);
              }}
            >
              {candidate}
            </Component>
          );
        })}
      </Menu>
    </Wrapper>
  );
};

export default Select;
