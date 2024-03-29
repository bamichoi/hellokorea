import Title from "Components/Title";
import Wrapper from "Components/Wrapper";
import { useParams, useSearchParams } from "react-router-dom";
import List from "Components/board/List";
import { useEffect, useState } from "react";
import Paginator from "Components/board/paginator";
import { useSearch } from "libs/useSearch";

function SearchResult() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const offset = 5;
  const { category } = useParams();
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page");
  const keyword = searchParams.get("keyword");
  const target = searchParams.get("target");
  const targetText =
    target === "title" ? "제목" : target === "wrtier" ? "작성자" : "내용";
  const currentPage = page ? parseInt(page) : 1;
  const { isLoading, data, errorMessage, isFetching, isPreviousData } =
    useSearch(category!, offset, currentIdx, keyword!, target!);
  useEffect(() => {
    setCurrentIdx(currentPage - 1);
  }, [currentPage]);
  return (
    <Wrapper>
      <main className="w-full flex flex-col justify-center px-10">
        <div className="flex items-start justify-between w-full flex-col">
          <Title text={category!} link={category} />
          <h2 className="text-main mb-5 text-2xl">{`${targetText}에 대한 ${keyword}의 검색결과`}</h2>
        </div>
        <List data={data} errorMessage={errorMessage} />
        <Paginator
          currentIdx={currentIdx}
          currentPage={currentPage}
          isPreviousData={isPreviousData}
          offset={offset}
          data={data}
          isSearcing={true}
          keyword={keyword!}
          target={target!}
        />
      </main>
    </Wrapper>
  );
}

export default SearchResult;
