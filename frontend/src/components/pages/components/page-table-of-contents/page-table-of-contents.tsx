import { Accordion, Card, useAccordionButton } from 'react-bootstrap';
import { Link as ScrollLink } from 'react-scroll';
import {
  IPageTableOfContents,
  IPageTableOfContentsHeading,
} from 'common/interfaces/pages';
import { useHistory, useState } from 'hooks/hooks';
import { getAllowedClasses } from 'helpers/helpers';
import styles from './styles.module.scss';

const SCROLL_OFFSET = 50;
const SCROLL_DURATION = 150;

interface IPageTableOfContentsProps extends IPageTableOfContents {}

const Toggle: React.FC<{ eventKey: string }> = ({ eventKey }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const decoratedOnClick = useAccordionButton(eventKey);

  const onClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ): void => {
    decoratedOnClick(e);
    setIsExpanded(!isExpanded);
  };

  return (
    <i
      onClick={onClick}
      className={getAllowedClasses(
        `bi ${isExpanded ? 'bi-chevron-down' : 'bi-chevron-right'}`,
        styles.chevronIcon,
      )}
    />
  );
};

const MenuItem: React.FC<{ heading: IPageTableOfContentsHeading }> = ({
  heading,
}) => {
  const history = useHistory();
  history;

  return (
    <Accordion flush>
      <Accordion.Item
        key={heading.slug}
        eventKey={heading.slug}
        className="bg-none"
      >
        {heading.children.length ? (
          <Accordion flush>
            <div>
              <Toggle eventKey={heading.slug} />

              <ScrollLink
                to={heading.slug}
                smooth={true}
                offset={SCROLL_OFFSET}
                duration={SCROLL_DURATION}
                className={styles.accordionTitle}
              >
                {heading.title}
              </ScrollLink>
            </div>

            <Accordion.Body className={styles.accordionBody}>
              {heading.children.map((heading) => {
                return <MenuItem key={heading.slug} heading={heading} />;
              })}
            </Accordion.Body>
          </Accordion>
        ) : (
          <ScrollLink
            to={heading.slug}
            smooth={true}
            offset={SCROLL_OFFSET}
            duration={SCROLL_DURATION}
            className={styles.accordionTitle}
          >
            {heading.title}
          </ScrollLink>
        )}
      </Accordion.Item>
    </Accordion>
  );
};

export const PageTableOfContents: React.FC<IPageTableOfContentsProps> = ({
  headings,
}) => {
  return (
    <Card border="light" className={styles.card}>
      <Card.Header className="bg-white border-0 d-flex align-items-center">
        Table of contents
      </Card.Header>
      <Card.Body className={styles.accordion}>
        <Accordion flush>
          {headings.map((heading) => {
            return <MenuItem key={heading.slug} heading={heading} />;
          })}
        </Accordion>
      </Card.Body>
    </Card>
  );
};