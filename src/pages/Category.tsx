import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import Categories from '../components/Tables/Categories';
import DefaultLayout from '../layout/DefaultLayout';

const Category = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Categories" />

      <div className="flex flex-col gap-10">
        <Categories />
      </div>
    </DefaultLayout>
  );
};

export default Category;
