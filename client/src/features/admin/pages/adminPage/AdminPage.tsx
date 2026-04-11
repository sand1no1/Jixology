import { RegisterUserForm } from '../../components/registerUserForm';
import { useRegisterUser } from '../../hooks/useRegisterUser';
import './adminPage.css';

export default function RegisterUserPage() {
  const { values, loading, error, success, handleChange, submit } =
    useRegisterUser();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await submit();
  };

  return (
    <main className="admin-page">
      <div className="admin-page__container">
        <section className="admin-page__card">
          <RegisterUserForm
            values={values}
            loading={loading}
            error={error}
            success={success}
            onChange={handleChange}
            onSubmit={handleSubmit}
          />
        </section>
      </div>
    </main>
  );
}