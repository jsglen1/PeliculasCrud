import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

const Form = ({formData, forNewMovie = true}) => {
  const router = useRouter();

  const [form, setForm] = useState({
    title: formData.title,
    plot: formData.plot,
  });

  const [menssage, setMenssage] = useState([]);

  const handleChange = (e) => {
    const { value, name } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (forNewMovie) {
      postData(form);
    } else {
      //editar data
      console.log("editando")
      putData(form)

    }
  };

  const putData = async (form) => {
    setMenssage([])
    const { id } = router.query;
    try {
      const res = await fetch(`/api/movie/${id}`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      console.log(data);

      if (!data.success) {
        console.log(" ojo" + data.success);
        for (const key in data.error.errors) {
          let error = data.error.errors[key];
          console.log("eche" + error);
          setMenssage((oldmenssage) => [
            ...oldmenssage,
            {
              message: error.message,
            },
          ]);
        }
      } else {
        setMenssage([])
        router.push("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const postData = async (form) => {
    try {
      console.log(form);
      const res = await fetch("/api/movie", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      console.log(data);

      if (!data.success) {
        console.log(" ojo" + data.success);
        for (const key in data.error.errors) {
          let error = data.error.errors[key];
          console.log("eche" + error);
          setMenssage((oldmenssage) => [
            ...oldmenssage,
            {
              message: error.message,
            },
          ]);
        }
      } else {
        router.push("/");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        className="form-control my-2"
        placeholder="Title"
        autoComplete="off"
        name="title"
        value={form.title}
        onChange={handleChange}
      />

      <input
        type="text"
        className="form-control my-2"
        placeholder="Title"
        autoComplete="off"
        name="plot"
        value={form.plot}
        onChange={handleChange}
      />

      <button className="btn btn-primary w-100" type="submit">
        {forNewMovie ? "Agregar" : "Editar"}
      </button>
      {console.log("ask" + forNewMovie + "form" + formData)}
      <Link href="/">
        <a className="btn btn-warning w-100 my-2">Volver...</a>
      </Link>
      {menssage.map(({ message }) => (
        <p key={message} className="text-danger">
          {" "}
          {message}{" "}
        </p>
      ))}
    </form>
  );
};

export default Form;
