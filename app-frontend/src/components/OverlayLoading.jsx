const OverlayLoading = () => {
  return (
    <div className="fixed inset-0 flex justify-center items-center backdrop-filter backdrop-blur-md bg-transparent z-100">
      {/* <div className="w-12 h-12 border-8 border-[#30834d] border-t-transparent rounded-full animate-spin"></div> */}
      <div className="relative">
        <div className="h-24 w-24 rounded-full border-t-8 border-b-8 border-gray-200"></div>
        <div className="absolute top-0 left-0 h-24 w-24 rounded-full border-t-8 border-b-8 border-green-700 animate-spin">
        </div>
    </div>
    </div>
  );
};

export default OverlayLoading;
