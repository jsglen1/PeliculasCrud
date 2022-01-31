import dbConnect from "../../lib/dbConnect";
import Movie from "../../models/Movie";
import Link from "next/link";
import { useRouter } from "next/router";

const MoviePage = ({ success, error, movie }) => {
  console.log(success);
  console.log(error);
  console.log(movie);

  const router = useRouter();

  if (!success) {
    return (
      <div className="container text-center my-5">
        <h1>{error} FAILURE!! </h1>
        <Link href="/">
          <a className="btn btn-success w-100">Volver...</a>
        </Link>
      </div>
    );
  }

  const handleDelete = async () => {
    
    const movieId = router.query.id;
    try {
      await fetch(`/api/movie/${movieId}`, {
        method: "DELETE",
      });
      router.push("/");
    } catch (error) {
      setMessage("Error al eliminar");
    }
  };



  return (
    <div className="container text-center">
      <h1 className="text-success">Detalle de Movie</h1>
      <div className="card">
        <div className="card-body">
          <div className="card-title">
            <h5 className="text-uppercase">{movie.title}</h5>
          </div>
          <p className="fw.light text-info">{movie.plot}</p>
          <Link href="/">
          <a className="btn btn-success w-20 me-2">Volver...</a>
        </Link>
        <button className="btn btn-success w-20 me-2" onClick={() => handleDelete()} >Eliminar...</button>
        </div>
      </div>
    </div>
  );
};

export default MoviePage;

export async function getServerSideProps({ params }) {
  try {
    await dbConnect();

    const movie = await Movie.findById(params.id).lean();

    if (!movie) {
      return { props: { success: false, error: "pelicula no encontrada" } };
    }

    console.log(movie);
    movie._id = movie._id.toString();

    return { props: { success: true, movie } };
  } catch (error) {
    console.log(error);
    if (error.kind === "ObjectId") {
      return { props: { success: false, error: "error ID No valido" } };
    }
    return { props: { success: false, error: "Otros errores servidor !!!" } };
  }
}
