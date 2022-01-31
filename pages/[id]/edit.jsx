import Form from "../../components/Form";
import useSWR from "swr";
import { useRouter } from "next/router";

const fetcher = async url => {
  const res = await fetch(url)

  // If the status code is not in the range 200-299,
  // we still try to parse and throw it.
  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.')
    // Attach extra info to the error object.
    error.info = await res.json()
    error.status = res.status
    throw error
  }

  const {data} = await res.json()

  return data
}

const EditMovie = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data: movie, error } = useSWR(
    id ? `/api/movie/${id}` : null,
    fetcher
  );

  if (error) return <p className="container my-3">Falló en la carga...</p>;
  if (!movie) return <p className="container my-3">Cargando...</p>;

  const formData = {
    title: movie.title,
    plot: movie.plot,
  };

  return (
    <div className="container">
      <h1>editar movie</h1>

      <Form forNewMovie={false} formData={formData} />
    </div>
  );
};

export default EditMovie;
