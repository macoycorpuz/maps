import Areas from './Areas';
import Footer from './Footer';
import GeneralInfo from './GeneralInfo';
import Markers from './Markers';
import Tabs from './Tabs';

interface Props {
  isOpen: boolean;
}

const Sidebar: React.FC<Props> = ({ isOpen }) => {
  const tabs = ['Markers', 'Areas', 'General Info'];

  return (
    <div
      className={
        'w-1/4 flex-col bg-white ' + (isOpen ? 'md:flex' : 'md:hidden')
      }
    >
      <div className="relative flex flex-1 flex-col justify-between overflow-y-auto">
        <Tabs tabs={tabs}>
          <Areas areas={[]} />
          <Markers markers={[]} />
          <GeneralInfo />
        </Tabs>
        <Footer name="Marcuz Corpuz" />
      </div>
    </div>
  );
};

export default Sidebar;
