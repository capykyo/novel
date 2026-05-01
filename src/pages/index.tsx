const IndexPage = () => null;
export default IndexPage;

export const getServerSideProps = () => ({
  redirect: { destination: "/bookshelf", permanent: false },
});
