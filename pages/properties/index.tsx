import type { GetStaticProps, InferGetStaticPropsType } from "next";
import Head from "next/head";
import type { ListingPropertyListResponse } from "../../components/properties/StaticPropertiesPage";
import StaticPropertiesPage from "../../components/properties/StaticPropertiesPage";
import catalog from "../../data/properties/catalog.json";
import site from "../../data/home/site.json";
import type { StaticCatalogContent } from "../../lib/properties/static-types";
import type { BuildingSummary, PropertyTerm } from "../../lib/properties/types";
import { loadAllBuildings, loadAllProperties } from "../../lib/properties/wordpress";

const emptyListingProperties: ListingPropertyListResponse = {
  facets: { buildings: [], locations: [], sectors: [], unitTypes: [] },
  items: [],
  pagination: { page: 1, perPage: 21, total: 0, totalPages: 0 },
};

function buildingTerm(building: BuildingSummary): PropertyTerm {
  return {
    id: building.id,
    name: building.name,
    slug: building.slug,
  };
}

function byTermName(left: PropertyTerm, right: PropertyTerm) {
  return left.name.localeCompare(right.name, "en", {
    numeric: true,
    sensitivity: "base",
  });
}

function residentialBuildingTerms(buildings: BuildingSummary[] = []) {
  return buildings
    .filter((building) =>
      building.sectors.some((sector) => sector.slug === "residential"),
    )
    .map(buildingTerm)
    .sort(byTermName);
}

export const getStaticProps = (async () => {
  const content = catalog as StaticCatalogContent;
  const [propertiesResult, buildingsResult] = await Promise.allSettled([
    loadAllProperties({ per_page: "200" }),
    loadAllBuildings({ per_page: "200" }),
  ]);
  const properties =
    propertiesResult.status === "fulfilled" ? propertiesResult.value : null;
  const buildings =
    buildingsResult.status === "fulfilled" ? buildingsResult.value : null;
  const filterBuildings = residentialBuildingTerms(buildings?.items);

  if (propertiesResult.status === "rejected") {
    console.warn("WordPress properties endpoint is unavailable.", propertiesResult.reason);
  }
  if (buildingsResult.status === "rejected") {
    console.warn("WordPress buildings endpoint is unavailable.", buildingsResult.reason);
  }

  const listingProperties: ListingPropertyListResponse = properties
    ? {
        facets: {
          ...properties.facets,
          buildings: filterBuildings,
        },
        items: properties.items.map((property) => ({
          amenities: property.amenities,
          annualRent: property.annualRent,
          areaSqm: property.areaSqm,
          bathrooms: property.bathrooms,
          bedrooms: property.bedrooms,
          building: property.building
            ? {
                cardImage: property.building.cardImage,
                id: property.building.id,
                latitude: property.building.latitude,
                locations: property.building.locations,
                longitude: property.building.longitude,
                name: property.building.name,
                slug: property.building.slug,
              }
            : null,
          cardImage: property.cardImage,
          currency: property.currency,
          floor: property.floor,
          id: property.id,
          locations: property.locations,
          salePrice: property.salePrice,
          sectors: property.sectors,
          slug: property.slug,
          status: property.status,
          summary: property.summary,
          title: property.title,
          transaction: property.transaction,
          unitCode: property.unitCode,
          unitTypes: property.unitTypes,
        })),
        pagination: properties.pagination,
      }
    : emptyListingProperties;

  return {
    props: {
      content,
      properties: properties
        ? listingProperties
        : {
            ...emptyListingProperties,
            facets: { ...emptyListingProperties.facets, buildings: filterBuildings },
          },
      site,
    },
    revalidate: 60,
  };
}) satisfies GetStaticProps;

export default function PropertiesRoute({
  content,
  properties,
  site: siteContent,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <Head>
        <title>Properties | ADURE</title>
        <meta
          name="description"
          content="Explore selected properties for sale and lease across Abu Dhabi, Dubai and Al Ain with ADURE."
        />
        <meta name="theme-color" content="#004789" />
      </Head>
      <StaticPropertiesPage content={content} properties={properties} site={siteContent} />
    </>
  );
}
